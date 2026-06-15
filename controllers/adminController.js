const User = require('../models/User');
const MedicalProfile = require('../models/MedicalProfile');
const ScanLog = require('../models/ScanLog');
const SecurityLog = require('../models/SecurityLog');

// Helper to log security event
const logSecurityEvent = async (adminId, action, details, req) => {
  try {
    await SecurityLog.create({
      user: adminId,
      action,
      details,
      ipAddress: req.ip || req.connection.remoteAddress || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });
  } catch (err) {
    console.error('Security log error:', err);
  }
};

/**
 * @desc    Get dashboard metrics / analytics
 * @route   GET /api/admin/analytics
 * @access  Private/Admin
 */
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalScans = await ScanLog.countDocuments();

    // Critical cases (profiles with critical risk score)
    const criticalCount = await MedicalProfile.countDocuments({ riskScore: 'Critical' });
    const highCount = await MedicalProfile.countDocuments({ riskScore: 'High' });
    const moderateCount = await MedicalProfile.countDocuments({ riskScore: 'Moderate' });
    const normalCount = await MedicalProfile.countDocuments({ riskScore: 'Normal' });

    // Active emergencies (scans in the last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeEmergencies = await ScanLog.countDocuments({ scanTime: { $gte: oneDayAgo } });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalScans,
        activeEmergencies,
        criticalCases: criticalCount,
        distribution: {
          Critical: criticalCount,
          High: highCount,
          Moderate: moderateCount,
          Normal: normalCount,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all users with their medical profile summary
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    
    // Fetch profiles for each user
    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        const profile = await MedicalProfile.findOne({ user: user._id });
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isSuspended: user.isSuspended,
          qrToken: user.qrToken,
          createdAt: user.createdAt,
          riskScore: profile ? profile.riskScore : 'Not Setup',
        };
      })
    );

    res.status(200).json({
      success: true,
      users: usersWithProfiles,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Toggle user suspension status
 * @route   PUT /api/admin/users/:id/suspend
 * @access  Private/Admin
 */
const toggleUserSuspension = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot suspend admin accounts' });
    }

    user.isSuspended = !user.isSuspended;
    await user.save();

    const action = user.isSuspended ? 'ACCOUNT_SUSPENDED' : 'ACCOUNT_UNSUSPENDED';
    const logDetails = `Account for ${user.email} was ${user.isSuspended ? 'suspended' : 'unsuspended'} by admin ${req.user.email}`;

    await logSecurityEvent(req.user.id, action, logDetails, req);

    res.status(200).json({
      success: true,
      message: `User account has been ${user.isSuspended ? 'suspended' : 'activated'}.`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isSuspended: user.isSuspended,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all security logs
 * @route   GET /api/admin/security-logs
 * @access  Private/Admin
 */
const getSecurityLogs = async (req, res) => {
  try {
    const logs = await SecurityLog.find()
      .populate('user', 'name email role')
      .sort({ timestamp: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all scan logs across the system
 * @route   GET /api/admin/scan-logs
 * @access  Private/Admin
 */
const getAllScanLogs = async (req, res) => {
  try {
    const logs = await ScanLog.find()
      .populate('user', 'name email')
      .sort({ scanTime: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAnalytics,
  getAllUsers,
  toggleUserSuspension,
  getSecurityLogs,
  getAllScanLogs,
};

const User = require('../models/User');
const MedicalProfile = require('../models/MedicalProfile');
const ScanLog = require('../models/ScanLog');

// Mock locations for rich demo logs
const responderLocations = [
  'Saint Jude General Hospital - ER Dept',
  'Ambulance Services - Unit 14 (Mobile)',
  'City Metro Transit - Responder Station 4',
  'State Medical Services - Node West',
  'Community Clinic - First Response Unit',
  'Emergency Care Dispatch - Center 2',
];

const getRandomLocation = () => {
  const idx = Math.floor(Math.random() * responderLocations.length);
  return responderLocations[idx];
};

/**
 * @desc    Get limited medical profile for emergency responders via QR token
 * @route   GET /api/profile/emergency/:qrToken
 * @access  Public
 */
const getEmergencyProfile = async (req, res) => {
  try {
    const { qrToken } = req.params;

    // Find user with this token
    const user = await User.findOne({ qrToken });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid or deactivated QR emergency code.' });
    }

    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: 'This medical identity has been suspended by the administrator.',
      });
    }

    // Find the profile
    const profile = await MedicalProfile.findOne({ user: user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'No emergency medical details have been configured for this user yet.',
      });
    }

    // Log the scan event for security audit
    const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown Browser';
    const location = getRandomLocation(); // Mocking realistic emergency location

    await ScanLog.create({
      user: user._id,
      ipAddress: ip,
      userAgent,
      location,
      riskLevelViewed: profile.riskScore,
    });

    // Extract ONLY the limited, emergency-safe details
    const emergencyData = {
      name: user.name,
      bloodGroup: profile.bloodGroup,
      allergies: profile.allergies.map(a => ({
        allergen: a.allergen,
        severity: a.severity,
      })),
      chronicDiseases: profile.chronicDiseases.map(d => ({
        disease: d.disease,
        severity: d.severity,
      })),
      currentMedications: profile.currentMedications,
      riskScore: profile.riskScore,
      emergencyContacts: profile.emergencyContacts,
      organDonorStatus: profile.organDonorStatus,
      updatedAt: profile.updatedAt,
    };

    res.status(200).json({
      success: true,
      emergencyData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get scan history for logged-in user
 * @route   GET /api/profile/scans
 * @access  Private
 */
const getMyScanLogs = async (req, res) => {
  try {
    const logs = await ScanLog.find({ user: req.user.id })
      .sort({ scanTime: -1 })
      .limit(50);

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
  getEmergencyProfile,
  getMyScanLogs,
};

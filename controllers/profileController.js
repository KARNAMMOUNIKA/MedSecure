const MedicalProfile = require('../models/MedicalProfile');
const SecurityLog = require('../models/SecurityLog');
const { calculateRisk } = require('../utils/riskCalculator');

// Helper to log security event
const logSecurityEvent = async (userId, action, details, req) => {
  try {
    await SecurityLog.create({
      user: userId,
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
 * @desc    Get current user's medical profile
 * @route   GET /api/profile/me
 * @access  Private
 */
const getMyProfile = async (req, res) => {
  try {
    const profile = await MedicalProfile.findOne({ user: req.user.id });

    res.status(200).json({
      success: true,
      profile: profile || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create or update user's medical profile
 * @route   PUT /api/profile/me
 * @access  Private
 */
const updateMyProfile = async (req, res) => {
  try {
    const {
      dob,
      gender,
      bloodGroup,
      allergies,
      chronicDiseases,
      currentMedications,
      height,
      weight,
      organDonorStatus,
      emergencyContacts,
      doctorInfo,
    } = req.body;

    if (!dob || !gender || !bloodGroup) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Date of Birth, Gender, and Blood Group',
      });
    }

    if (!emergencyContacts || emergencyContacts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please add at least one emergency contact',
      });
    }

    // Build profile object
    const profileFields = {
      user: req.user.id,
      dob,
      gender,
      bloodGroup,
      allergies: allergies || [],
      chronicDiseases: chronicDiseases || [],
      currentMedications: currentMedications || [],
      height: height || undefined,
      weight: weight || undefined,
      organDonorStatus: organDonorStatus || 'Undecided',
      emergencyContacts,
      doctorInfo: doctorInfo || {},
    };

    // Calculate Medical Risk Score using the risk calculator utility
    const riskResult = calculateRisk(profileFields);
    profileFields.riskScore = riskResult.riskScore;
    profileFields.riskBreakdown = riskResult.riskBreakdown;

    // Find and update or create
    let profile = await MedicalProfile.findOne({ user: req.user.id });

    if (profile) {
      profile = await MedicalProfile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      await logSecurityEvent(req.user.id, 'PROFILE_UPDATE', 'Medical profile updated successfully', req);
    } else {
      profile = new MedicalProfile(profileFields);
      await profile.save();
      await logSecurityEvent(req.user.id, 'PROFILE_UPDATE', 'Medical profile created successfully', req);
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};

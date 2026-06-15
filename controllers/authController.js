const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SecurityLog = require('../models/SecurityLog');
const crypto = require('crypto');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'medsecure_secret_token_38927498237498273948273', {
    expiresIn: '30d',
  });
};

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
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please add all fields' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
    });

    if (user) {
      await logSecurityEvent(user._id, 'LOGIN_SUCCESS', `Account created successfully for email: ${email}`, req);

      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        qrToken: user.qrToken,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Authenticate a user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      // Log failed login
      await logSecurityEvent(null, 'LOGIN_FAILURE', `Failed login attempt for non-existent email: ${email}`, req);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.isSuspended) {
      await logSecurityEvent(user._id, 'LOGIN_FAILURE', `Blocked login attempt for suspended account: ${email}`, req);
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.',
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      await logSecurityEvent(user._id, 'LOGIN_FAILURE', `Failed login attempt for user: ${email} (incorrect password)`, req);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    await logSecurityEvent(user._id, 'LOGIN_SUCCESS', `User logged in: ${email}`, req);

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      qrToken: user.qrToken,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Forgot Password - Request Reset OTP
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with that email' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP and set expiry (10 minutes)
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    user.resetPasswordToken = hashedOtp;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    await logSecurityEvent(user._id, 'PASSWORD_RESET_REQUEST', `Password reset OTP generated for email: ${email}`, req);

    // In production, send email. For development, return OTP in response.
    res.status(200).json({
      success: true,
      message: 'OTP sent to email',
      otp, // Sending OTP back directly to bypass real email configs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Reset Password with OTP
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({ success: false, message: 'Please add all fields' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Hash user-submitted OTP to compare
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    // Check if token matches and is not expired
    if (user.resetPasswordToken !== hashedOtp || user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    await logSecurityEvent(user._id, 'PASSWORD_RESET_SUCCESS', `Password successfully reset for email: ${email}`, req);

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};

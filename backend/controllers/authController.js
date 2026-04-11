const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendOtpEmail, sendResetSuccessEmail } = require('../utils/emailService');
const { logAudit } = require('../utils/auditLogger');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

/**
 * @desc    Auth user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    }).select('+password');
    if (!user) {
      await logAudit(req, 'LOGIN_FAILED', null, `Failed login attempt for username: ${username}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      await logAudit(req, 'LOGIN_FAILED', user._id, `Failed login attempt for username: ${username}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status !== 'active') {
      await logAudit(req, 'LOGIN_FAILED', user._id, `Failed login attempt for username: ${username} (Account ${user.status})`);
      return res.status(403).json({ success: false, message: `Account is ${user.status}. Please contact administrator.` });
    }

    await logAudit(req, 'LOGIN_SUCCESS', user._id, `Successful login for username: ${username}`);

    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileId: user.profileId,
        profileModel: user.profileModel,
        profileImage: user.profileImage,
        isFirstLogin: user.isFirstLogin,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    First login forced password reset
 * @route   POST /api/auth/first-login-reset
 * @access  Private
 */
const firstLoginReset = async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user.isFirstLogin) {
      return res.status(400).json({ success: false, message: 'Password has already been reset' });
    }

    user.password = newPassword;
    user.isFirstLogin = false;
    await user.save();

    await logAudit(req, 'PASSWORD_RESET_SUCCESS', user._id, 'Completed first-login forced password reset');
    await sendResetSuccessEmail(user.email, user.username);

    // Check if teacher has pending registration payment
    const responseData = { success: true, message: 'Password reset successfully' };
    if (user.role === 'TEACHER' && user.pendingRegistrationPayment) {
      // Fetch teacher profile to get the fee amount
      const Teacher = require('../models/Teacher');
      const teacher = await Teacher.findById(user.profileId).lean();
      responseData.pendingPayment = true;
      responseData.registrationFee = teacher?.registrationFee || 0;
    }

    res.json(responseData);
  } catch (error) {
    console.error(error);
    await logAudit(req, 'PASSWORD_RESET_FAILED', req.user._id, 'Failed first-login forced password reset');
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Request OTP for password reset
 * @route   POST /api/auth/request-otp
 * @access  Public
 */
const requestOtp = async (req, res) => {
  const { identifier } = req.body; // username or email

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user) {
      // Don't reveal user existence
      return res.json({ success: true, message: 'If you have an account, an OTP has been sent' });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP for DB
    const salt = await bcrypt.genSalt(10);
    user.resetOtp = await bcrypt.hash(otp, salt);
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await logAudit(req, 'OTP_REQUEST', user._id, 'OTP requested for password reset');
    await sendOtpEmail(user.email, user.username, otp);

    res.json({ success: true, message: 'If you have an account, an OTP has been sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Verify OTP for password reset
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
const verifyOtp = async (req, res) => {
  const { identifier, otp } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    }).select('+resetOtp +resetOtpExpires');

    if (!user || !user.resetOtp || !user.resetOtpExpires || user.resetOtpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    const isValid = await bcrypt.compare(otp, user.resetOtp);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Generate a temporary reset token to allow password change in the next step
    // Using JWT for this short-lived token (5 mins)
    const resetToken = jwt.sign(
      { id: user._id, purpose: 'reset-password' },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '5m' }
    );

    res.json({ success: true, data: { resetToken } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Reset password using reset token from OTP verification
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'secret123');

    if (decoded.purpose !== 'reset-password') {
      return res.status(401).json({ success: false, message: 'Invalid reset token' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    await logAudit(req, 'PASSWORD_RESET_SUCCESS', user._id, 'Reset password via OTP');
    await sendResetSuccessEmail(user.email, user.username);

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    // Might fail if token is invalid or expired
    const errUserId = error.name === 'TokenExpiredError' ? null : null; // Can't reliably know user if decode fails
    await logAudit(req, 'PASSWORD_RESET_FAILED', errUserId, 'Failed password reset via OTP');
    res.status(401).json({ success: false, message: 'Invalid or expired reset token' });
  }
};

/**
 * @desc    Create a demo admin if none exists
 * @route   POST /api/auth/demo-admin
 * @access  Public
 */
const createAdmin = async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ role: 'ADMIN' });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'An Admin already exists. Cannot create another demo admin.' });
    }

    const { username = 'admin', email = 'admin@demo.com', password = 'password123' } = req.body;

    const user = await User.create({
      username,
      email,
      password,
      role: 'ADMIN',
      status: 'active',
      isFirstLogin: false // Demo admin can login immediately
    });

    res.status(201).json({
      success: true,
      message: 'Demo Admin created successfully',
      data: { username, email, password }
    });
  } catch (error) {
    console.error('Error creating demo admin:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  login,
  firstLoginReset,
  requestOtp,
  verifyOtp,
  resetPassword,
  createAdmin
};



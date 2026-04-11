const express = require('express');
const {
  login,
  firstLoginReset,
  requestOtp,
  verifyOtp,
  resetPassword,
  createAdmin
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.post('/first-login-reset', protect, firstLoginReset);
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

router.post('/demo-admin', createAdmin);

module.exports = router;

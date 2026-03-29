const express = require('express');
const router = express.Router();
const { register, login, getMe, requestOtp, verifyOtp } = require('../controllers/auth');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/otp-request', requestOtp);
router.post('/otp-verify', verifyOtp);
router.get('/me', protect, getMe);

module.exports = router;

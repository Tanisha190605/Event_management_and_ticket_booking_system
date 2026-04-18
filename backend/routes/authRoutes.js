const express = require('express');
const router = express.Router();
const { signup, login, verifyEmail, getMe, adminLogin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.get('/me', protect, getMe);

// Public endpoint for admin login
router.post('/admin-login', adminLogin);

module.exports = router;

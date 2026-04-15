const express = require('express');
const router = express.Router();
const { getEmailSettings, updateEmailSettings, testEmailSettings } = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/email', protect, admin, getEmailSettings);
router.put('/email', protect, admin, updateEmailSettings);
router.post('/email/test', protect, admin, testEmailSettings);

module.exports = router;


const express = require('express');
const router = express.Router();
const { verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/verify', protect, verifyPayment);

module.exports = router;

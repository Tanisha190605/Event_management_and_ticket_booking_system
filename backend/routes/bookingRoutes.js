const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAdminBookings, getBookingById, updateBookingStatus } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/', protect, admin, getAdminBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, admin, updateBookingStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const { bookTicket, getUserBookings, getEventBookings } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, bookTicket);
router.get('/my-bookings', protect, getUserBookings);
router.get('/event/:eventId', protect, authorize('organizer', 'admin'), getEventBookings);

module.exports = router;
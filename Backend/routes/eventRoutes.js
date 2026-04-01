const express = require('express');
const router = express.Router();
const { createEvent, getEvents, getEventById, updateEvent, deleteEvent } = require('../Backend/controllers/eventController');
const { protect, authorize } = require('../Backend/middleware/authMiddleware');

router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes
router.post('/', protect, authorize('organizer', 'admin'), createEvent);
router.put('/:id', protect, authorize('organizer', 'admin'), updateEvent);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent);

module.exports = router;
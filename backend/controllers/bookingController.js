const Booking = require('../models/bookingModel');
const Event = require('../models/eventModel');
const Razorpay = require('razorpay');

// Create razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Initiate a booking (lock seats & create Razorpay order)
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { eventId, seats, totalAmount } = req.body;

    if (!eventId || !seats || !seats.length || !totalAmount) {
      return res.status(400).json({ message: 'Please provide eventId, seats, and totalAmount' });
    }

    const seatIds = seats.map(s => s.id);

    // Atomic update to lock seats — only succeed if NONE of the seats are already booked
    const event = await Event.findOneAndUpdate(
      {
        _id: eventId,
        bookedSeatIds: { $nin: seatIds },
      },
      {
        $inc: { bookedSeats: seats.length },
        $push: { bookedSeatIds: { $each: seatIds } },
      },
      { new: true }
    );

    if (!event) {
      return res.status(400).json({ message: 'One or more selected seats are already booked. Please choose different seats.' });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(totalAmount * 100), // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create(options);
    } catch (err) {
      // Rollback seat lock if Razorpay fails
      await Event.findByIdAndUpdate(eventId, {
        $inc: { bookedSeats: -seats.length },
        $pullAll: { bookedSeatIds: seatIds },
      });
      console.error('Razorpay order creation failed:', err);
      return res.status(500).json({ message: 'Payment gateway error. Please try again.' });
    }

    const booking = new Booking({
      user: req.user._id,
      event: eventId,
      seats,
      totalAmount,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: 'pending',
      bookingStatus: 'pending',
    });

    const createdBooking = await booking.save();

    res.status(201).json({
      booking: createdBooking,
      orderId: razorpayOrder.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAdminBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'id name email')
      .populate('event', 'title date venue city category pricing')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('event')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure user can only access their own bookings (unless admin)
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status (cancel/confirm)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only process cancellation if not already cancelled
    if (status === 'cancelled' && booking.bookingStatus !== 'cancelled') {
      const seatIds = booking.seats.map(s => s.id);
      await Event.findByIdAndUpdate(booking.event, {
        $inc: { bookedSeats: -booking.seats.length },
        $pullAll: { bookedSeatIds: seatIds },
      });
      // Optionally could handle razorpay refund logic here if integrated
    }

    booking.bookingStatus = status;
    const updatedBooking = await booking.save();

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAdminBookings,
  getBookingById,
  updateBookingStatus,
};

const Booking = require('../../models/Booking');
const Event = require('../../models/Event');

exports.bookTicket = async (req, res, next) => {
  try {
    const { eventId, seatsBooked } = req.body;
    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Prevent Overbooking Logic
    if (event.availableSeats < seatsBooked) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    const booking = new Booking({
      user: req.user._id,
      event: eventId,
      seatsBooked,
      totalPrice: event.price * seatsBooked
    });

    await booking.save();

    // Reduce available seats
    event.availableSeats -= seatsBooked;
    await event.save();

    res.status(201).json(booking);
  } catch (error) { next(error); }
};

exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('event');
    res.json(bookings);
  } catch (error) { next(error); }
};

exports.getEventBookings = async (req, res, next) => {
    try {
      const bookings = await Booking.find({ event: req.params.eventId }).populate('user', 'name email');
      res.json(bookings);
    } catch (error) { next(error); }
  };
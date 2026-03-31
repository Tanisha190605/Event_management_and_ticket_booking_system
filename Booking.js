
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/eventsDB');

const eventSchema = new mongoose.Schema({
  title: String,
  seats: Number,
  price: Number
});

const bookingSchema = new mongoose.Schema({
  eventId: String,
  userId: String,
  seatsBooked: Number,
  totalPrice: Number
});

const Event = mongoose.model('Event', eventSchema);
const Booking = mongoose.model('Booking', bookingSchema);

app.post('/book', async (req, res) => {
  const { eventId, userId, seatsBooked } = req.body;

  const event = await Event.findById(eventId);

  if (!event) return res.json({ message: 'Event not found' });
  if (event.seats < seatsBooked) return res.json({ message: 'Not enough seats' });
  if (seatsBooked > 5) return res.json({ message: 'Max 5 tickets allowed' });

  event.seats -= seatsBooked;
  await event.save();

  const booking = new Booking({
    eventId,
    userId,
    seatsBooked,
    totalPrice: seatsBooked * event.price
  });

  await booking.save();

  res.json({ message: 'Booking successful', booking });
});

app.get('/my-bookings/:userId', async (req, res) => {
  const bookings = await Booking.find({ userId: req.params.userId });
  res.json(bookings);
});

app.listen(4000);



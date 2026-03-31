
const express2 = require('express');
const mongoose2 = require('mongoose');
const QRCode = require('qrcode');

const app2 = express2();
app2.use(express2.json());

mongoose2.connect('mongodb://127.0.0.1:27017/eventsDB');

const bookingSchema2 = new mongoose2.Schema({
  eventId: String,
  userId: String,
  seatsBooked: Number,
  totalPrice: Number
});

const Booking2 = mongoose2.model('Booking2', bookingSchema2);

app2.get('/ticket/:bookingId', async (req, res) => {
  const booking = await Booking2.findById(req.params.bookingId);

  if (!booking) return res.json({ message: 'Booking not found' });

  const qrData = {
    bookingId: booking._id,
    eventId: booking.eventId,
    userId: booking.userId,
    seats: booking.seatsBooked
  };

  const qr = await QRCode.toDataURL(JSON.stringify(qrData));

  res.json({
    ticket: {
      bookingId: booking._id,
      eventId: booking.eventId,
      userId: booking.userId,
      seats: booking.seatsBooked,
      totalPrice: booking.totalPrice,
      qr
    }
  });
});

app2.listen(5001);
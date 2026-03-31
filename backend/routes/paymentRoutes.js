const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const Event = require("../models/Event");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: "YOUR_KEY_ID",
  key_secret: "YOUR_KEY_SECRET"
});

// Create Order
router.post("/order", async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);

  const options = {
    amount: booking.amount * 100,
    currency: "INR",
    receipt: bookingId
  };

  const order = await razorpay.orders.create(options);

  res.json(order);
});

// Verify Payment
router.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", "YOUR_KEY_SECRET")
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {

    const booking = await Booking.findById(bookingId);
    booking.status = "confirmed";
    booking.paymentId = razorpay_payment_id;

    await booking.save();

    // reduce seats
    const event = await Event.findById(booking.eventId);
    event.availableSeats -= booking.seats;
    await event.save();

    res.json({ message: "Payment successful" });

  } else {
    res.status(400).json({ message: "Invalid payment" });
  }
});

module.exports = router;
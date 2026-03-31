const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userName: String,
  eventId: String,
  seats: Number,
  amount: Number,
  paymentId: String,
  status: { type: String, default: "pending" }
});

module.exports = mongoose.model("Booking", bookingSchema);
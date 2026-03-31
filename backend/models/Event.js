const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  date: String,
  venue: String,
  price: Number,
  totalSeats: Number,
  availableSeats: Number
});

module.exports = mongoose.model("Event", eventSchema);
const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  price: { type: Number, required: true, default: 0 },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
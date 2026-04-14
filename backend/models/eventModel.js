const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    city: { type: String, required: true },
    image: { type: String, required: true },
    banner: { type: String, required: false },
    organizer: { type: String, required: true },
    rating: { type: Number, default: 0 },
    tags: [String],
    pricing: {
      VIP: { type: Number, default: 0 },
      Premium: { type: Number, default: 0 },
      General: { type: Number, default: 0 },
    },
    totalSeats: { type: Number, required: true },
    bookedSeats: { type: Number, default: 0 },
    bookedSeatIds: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);

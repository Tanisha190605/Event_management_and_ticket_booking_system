const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Event',
    },
    seats: [
      {
        id: { type: String, required: true },
        row: { type: Number, required: true },
        col: { type: Number, required: true },
        rowLabel: { type: String, required: true },
        number: { type: Number, required: true },
        tier: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    qrCode: { type: String }, // Base64 string of the ticket QR
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);

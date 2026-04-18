const crypto = require('crypto');
const Booking = require('../models/bookingModel');
const Event = require('../models/eventModel');
const QRCode = require('qrcode');
const sendEmail = require('../utils/emailService');

// @desc    Verify payment signature and confirm booking
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !booking_id) {
      return res.status(400).json({ message: 'Missing payment verification data' });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const booking = await Booking.findById(booking_id).populate('user').populate('event');

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      booking.paymentStatus = 'completed';
      booking.bookingStatus = 'confirmed';
      booking.razorpayPaymentId = razorpay_payment_id;

      // Generate QR Code containing booking info
      const qrData = JSON.stringify({
        bookingId: booking._id,
        eventTitle: booking.event.title,
        eventDate: booking.event.date,
        userName: booking.user.name,
        seats: booking.seats.map(s => s.id).join(', '),
        amount: booking.totalAmount,
      });

      const qrCodeUrl = await QRCode.toDataURL(qrData);
      booking.qrCode = qrCodeUrl;

      await booking.save();

      // Send confirmation email
      const seatList = booking.seats.map(s => `${s.id} (${s.tier})`).join(', ');
      const eventDate = new Date(booking.event.date).toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });

      const message = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #121826; color: #f1f5f9; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; color: white;">✦ Booking Confirmed!</h1>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #22c55e; margin-top: 0;">Hi ${booking.user.name}! 🎉</h2>
            <p style="color: #94a3b8;">Your booking for <strong style="color: #818cf8;">${booking.event.title}</strong> has been confirmed.</p>
            
            <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse; color: #f1f5f9;">
                <tr><td style="padding: 8px 0; color: #64748b;">Event</td><td style="padding: 8px 0; font-weight: 600;">${booking.event.title}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b;">Date</td><td style="padding: 8px 0;">${eventDate}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b;">Venue</td><td style="padding: 8px 0;">${booking.event.venue}, ${booking.event.city}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b;">Seats</td><td style="padding: 8px 0;">${seatList}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b;">Amount Paid</td><td style="padding: 8px 0; color: #22c55e; font-weight: 600;">₹${booking.totalAmount.toLocaleString('en-IN')}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b;">Booking ID</td><td style="padding: 8px 0; font-family: monospace;">${booking._id}</td></tr>
              </table>
            </div>

            <div style="text-align: center; margin: 24px 0;">
              <p style="color: #94a3b8; margin-bottom: 12px;">Your ticket QR code — show this at the entrance:</p>
              <img src="${qrCodeUrl}" alt="Ticket QR Code" style="width: 180px; height: 180px; border-radius: 12px; background: white; padding: 8px;" />
            </div>
          </div>
          <div style="padding: 16px 32px; background: rgba(255,255,255,0.03); text-align: center; color: #475569; font-size: 12px;">
            © 2026 EMATBS. All rights reserved.
          </div>
        </div>
      `;

      try {
        await sendEmail({
          email: booking.user.email,
          subject: `🎫 Booking Confirmed: ${booking.event.title}`,
          message,
        });
      } catch (emailErr) {
        console.warn('Confirmation email failed:', emailErr.message);
      }

      res.status(200).json({ message: 'Payment verified successfully', booking });
    } else {
      // Payment signature invalid — mark booking as failed
      const booking = await Booking.findById(booking_id);
      if (booking) {
        booking.paymentStatus = 'failed';
        await booking.save();

        // Rollback seats
        const seatIds = booking.seats.map(s => s.id);
        await Event.findByIdAndUpdate(booking.event, {
          $inc: { bookedSeats: -booking.seats.length },
          $pullAll: { bookedSeatIds: seatIds },
        });
      }
      res.status(400).json({ message: 'Payment verification failed. Invalid signature.' });
    }
  } catch (error) {
    console.error('Payment verify error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  verifyPayment,
};

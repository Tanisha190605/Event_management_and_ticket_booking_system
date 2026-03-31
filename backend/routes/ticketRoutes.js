const express = require("express");
const QRCode = require("qrcode");
const Booking = require("../models/Booking");

const router = express.Router();

router.get("/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking || booking.status !== "confirmed") {
      return res.json({ message: "Invalid ticket" });
    }

    const ticketData = {
      bookingId: booking._id,
      user: booking.userName,
      seats: booking.seats
    };

    const qr = await QRCode.toDataURL(JSON.stringify(ticketData));

    res.json({
      ticket: ticketData,
      qr
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
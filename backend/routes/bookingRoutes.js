const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Booking = require("../models/Booking");

// Create booking (before payment)
router.post("/create", async (req, res) => {
  try {
    const { userName, eventId, seats } = req.body;

    const event = await Event.findById(eventId);

    if (!event) return res.json({ message: "Event not found" });

    if (event.availableSeats < seats) {
      return res.json({ message: "Not enough seats" });
    }

    const amount = event.price * seats;

    const booking = new Booking({
      userName,
      eventId,
      seats,
      amount
    });

    await booking.save();

    res.json({ booking });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
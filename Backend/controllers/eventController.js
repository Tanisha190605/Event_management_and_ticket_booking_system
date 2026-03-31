const Event = require('../../models/Event');

exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, location, date, price, totalSeats } = req.body;
    const event = new Event({
      organizer: req.user._id,
      title, description, location, date, price,
      totalSeats, availableSeats: totalSeats
    });
    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) { next(error); }
};

exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find({}).populate('organizer', 'name email');
    res.json(events);
  } catch (error) { next(error); }
};

exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) res.json(event);
    else res.status(404).json({ message: 'Event not found' });
  } catch (error) { next(error); }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (error) { next(error); }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } catch (error) { next(error); }
};
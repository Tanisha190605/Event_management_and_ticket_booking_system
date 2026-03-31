// eventManagement.js
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/eventsDB');

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  time: String,
  venue: String,
  category: String,
  price: Number,
  seats: Number,
  image: String
});

const Event = mongoose.model('Event', eventSchema);

app.post('/events', async (req, res) => {
  const event = new Event(req.body);
  await event.save();
  res.json(event);
});

app.get('/events', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

app.put('/events/:id', async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(event);
});

app.delete('/events/:id', async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

app.listen(3000);




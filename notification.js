const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/eventsDB');

const notificationSchema = new mongoose.Schema({
  userId: String,
  message: String
});

const Notification = mongoose.model('Notification', notificationSchema);

// Create notification
app.post('/notify', async (req, res) => {
  const note = new Notification(req.body);
  await note.save();
  res.json(note);
});

// Get notifications
app.get('/notify/:userId', async (req, res) => {
  const notes = await Notification.find({ userId: req.params.userId });
  res.json(notes);
});

app.listen(7000);
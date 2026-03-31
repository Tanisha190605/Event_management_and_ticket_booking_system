const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/eventsDB');

const reviewSchema = new mongoose.Schema({
  eventId: String,
  userName: String,
  rating: Number,
  comment: String
});

const Review = mongoose.model('Review', reviewSchema);

// Add review
app.post('/review', async (req, res) => {
  const review = new Review(req.body);
  await review.save();
  res.json(review);
});

// Get reviews by event
app.get('/review/:eventId', async (req, res) => {
  const reviews = await Review.find({ eventId: req.params.eventId });
  res.json(reviews);
});

app.listen(6000);
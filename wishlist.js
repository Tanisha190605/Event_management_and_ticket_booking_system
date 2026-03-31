const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/eventsDB');

const wishlistSchema = new mongoose.Schema({
  userId: String,
  eventId: String
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

// Add to wishlist
app.post('/wishlist', async (req, res) => {
  const item = new Wishlist(req.body);
  await item.save();
  res.json(item);
});

// Get wishlist
app.get('/wishlist/:userId', async (req, res) => {
  const items = await Wishlist.find({ userId: req.params.userId });
  res.json(items);
});

app.listen(5000);
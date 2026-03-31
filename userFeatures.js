const express2 = require('express');
const mongoose2 = require('mongoose');
const jwt = require('jsonwebtoken');

const app2 = express2();
app2.use(express2.json());

mongoose2.connect('mongodb://127.0.0.1:27017/eventsDB');

const userSchema = new mongoose2.Schema({
  name: String,
  email: String,
  password: String
});

const eventSchema2 = new mongoose2.Schema({
  title: String,
  date: String,
  price: Number,
  category: String
});

const User = mongoose2.model('User', userSchema);
const Event2 = mongoose2.model('Event2', eventSchema2);

app2.post('/signup', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

app2.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.json({ message: 'User not found' });

  const token = jwt.sign({ id: user._id }, 'secret');
  res.json({ token });
});

app2.get('/events', async (req, res) => {
  const events = await Event2.find();
  res.json(events);
});

app2.get('/events/filter', async (req, res) => {
  const { category, maxPrice } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (maxPrice) filter.price = { $lte: maxPrice };

  const events = await Event2.find(filter);
  res.json(events);
});

app2.listen(4000);

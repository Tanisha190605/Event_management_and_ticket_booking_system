const express = require('express');
const app = express();
const connectDB = require('./config/db.js');

// DB Connection
connectDB();

// Middleware
app.use(express.json());

// Routes
const eventRoutes = require('./modules/event/event.routes');

app.use('/api/events', eventRoutes);

const wishlistRoutes = require('./modules/wishlist/wishlist.routes');

app.use('/api/wishlist', wishlistRoutes);

module.exports = app;
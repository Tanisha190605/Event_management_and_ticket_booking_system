require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/userModel');

// Connect Database and Initialize Admin
const initializeData = async () => {
  try {
    await connectDB();
    
    // Auto-create default admin if none exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      console.log('No admin found. Creating default admin...');
      await User.create({
        name: 'System Admin',
        email: 'admin@ematbs.com',
        password: 'admin123',
        role: 'admin',
        isVerified: true
      });
      console.log('✅ Default admin created: admin@ematbs.com / admin123');
    }
  } catch (error) {
    console.error('Failed to initialize database/admin:', error.message);
  }
};

initializeData();

const app = express();

// Middleware
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: [frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Basic Route for testing
app.get('/api', (req, res) => {
  res.json({ message: 'EMATBS Backend API is running' });
});

// Import Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err.message);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

const Booking = require('../models/bookingModel');
const Event = require('../models/eventModel');
const User = require('../models/userModel');

// @desc    Get admin dashboard stats
// @route   GET /api/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    // Total counts
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const activeEvents = await Event.countDocuments();

    // Total revenue from confirmed bookings
    const revenueAgg = await Booking.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    // Monthly revenue for the current year
    const currentYear = new Date().getFullYear();
    const monthlyRevenueAgg = await Booking.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          createdAt: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear + 1, 0, 1),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Build 12-month array
    const monthlyRevenue = Array(12).fill(0);
    const monthlyBookings = Array(12).fill(0);
    monthlyRevenueAgg.forEach(m => {
      monthlyRevenue[m._id - 1] = m.revenue;
      monthlyBookings[m._id - 1] = m.count;
    });

    // Tier breakdown
    const tierAgg = await Booking.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $unwind: '$seats' },
      { $group: { _id: '$seats.tier', count: { $sum: 1 }, revenue: { $sum: '$seats.price' } } },
    ]);

    const tierBreakdown = {};
    tierAgg.forEach(t => {
      tierBreakdown[t._id] = { count: t.count, revenue: t.revenue };
    });

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('event', 'title date category')
      .sort({ createdAt: -1 })
      .limit(10);

    // Events with booking stats
    const eventStats = await Event.find()
      .select('title totalSeats bookedSeats category')
      .sort({ bookedSeats: -1 })
      .limit(10);

    res.json({
      totalRevenue,
      totalBookings,
      totalUsers,
      activeEvents,
      monthlyRevenue,
      monthlyBookings,
      tierBreakdown,
      recentBookings,
      eventStats,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats };

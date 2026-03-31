const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    date: String,
    time: String,
    venue: String,
    category: String,
    price: Number,
    seats: Number,
    image: String
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
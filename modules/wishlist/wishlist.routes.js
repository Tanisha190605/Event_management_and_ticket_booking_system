const express = require('express');
const router = express.Router();

const {
    addToWishlist,
    getWishlist,
    removeFromWishlist
} = require('./wishlist.controller');

// Routes
router.post('/:eventId', addToWishlist);
router.get('/:userId', getWishlist);
router.delete('/:userId/:eventId', removeFromWishlist);

module.exports = router;
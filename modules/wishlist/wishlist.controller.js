const Wishlist = require('./wishlist.model');

// ADD TO WISHLIST
exports.addToWishlist = async (req, res) => {
    try {
        const { userId } = req.body;
        const { eventId } = req.params;

        const exists = await Wishlist.findOne({ userId, eventId });

        if (exists) {
            return res.status(400).json({ message: "Already in wishlist" });
        }

        const wishlist = new Wishlist({ userId, eventId });
        await wishlist.save();

        res.status(201).json({ message: "Added to wishlist" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET USER WISHLIST
exports.getWishlist = async (req, res) => {
    try {
        const { userId } = req.params;

        const items = await Wishlist.find({ userId }).populate('eventId');

        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// REMOVE FROM WISHLIST
exports.removeFromWishlist = async (req, res) => {
    try {
        const { userId, eventId } = req.params;

        await Wishlist.findOneAndDelete({ userId, eventId });

        res.json({ message: "Removed from wishlist" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
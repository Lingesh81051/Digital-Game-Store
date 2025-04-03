// backend/routes/library.js
const express = require('express');
const router = express.Router();
const Library = require('../models/Library');
const { protect } = require('../middleware/authMiddleware');

// Add a game to the user's library
router.post('/', protect, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    // Find the user's library or create a new one
    let library = await Library.findOne({ user: req.user._id });
    if (!library) {
      library = new Library({ user: req.user._id, games: [] });
    }
    // Add the game if it isn't already in the library
    if (!library.games.includes(productId)) {
      library.games.push(productId);
      await library.save();
    }
    res.status(201).json(library);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get the user's library
router.get('/', protect, async (req, res) => {
  try {
    let library = await Library.findOne({ user: req.user._id }).populate('games', 'name price image');
    // If no library exists, create an empty one and return it
    if (!library) {
      library = new Library({ user: req.user._id, games: [] });
      await library.save();
    }
    res.json(library);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

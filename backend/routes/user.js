// backend/routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Library = require('../models/Library');
const { protect } = require('../middleware/authMiddleware');

// GET /api/user/profile - Get user wishlist and cart
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('wishlist')
      .populate('cart.product');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      phone: user.phone,
      dob: user.dob,
      gender: user.gender,
      address: user.address,
      securityQuestion: user.securityQuestion,
      securityAnswer: user.securityAnswer,
      wishlist: user.wishlist,
      cart: user.cart,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// NEW: GET /api/user/cart - Get user cart items
router.get('/cart', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/user/wishlist - Add product to wishlist
router.post('/wishlist', protect, async (req, res) => {
  const { productId } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/user/wishlist/:productId - Remove product from wishlist
router.delete('/wishlist/:productId', protect, async (req, res) => {
  const { productId } = req.params;
  try {
    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/user/cart - Add/update product in cart
router.post('/cart', protect, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const cartItem = user.cart.find(item => item.product.toString() === productId);
    if (cartItem) {
      // Update quantity if item exists (default to quantity provided, or 1 if not given)
      cartItem.quantity = quantity || cartItem.quantity;
    } else {
      // Otherwise, add new item to cart with default quantity 1 if not provided
      user.cart.push({ product: productId, quantity: quantity || 1 });
    }
    await user.save();
    res.json({ cart: user.cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/user/cart/:productId - Remove product from cart
router.delete('/cart/:productId', protect, async (req, res) => {
  const { productId } = req.params;
  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    await user.save();
    res.json({ cart: user.cart });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// NEW: GET /api/user/library - Get user's library with populated game details
router.get('/library', protect, async (req, res) => {
  try {
    const library = await Library.findOne({ user: req.user.id }).populate('games');
    // If no library exists yet, return an empty games array
    if (!library) {
      return res.json({ games: [] });
    }
    res.json(library);
  } catch (error) {
    console.error("Error fetching library:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// NEW: POST /api/user/library - Add a game to the user's library
router.post('/library', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    // Check if the product exists (assuming you have a Product model)
    const Product = require('../models/Product');
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the user's library; create one if it doesn't exist
    let library = await Library.findOne({ user: userId });
    if (!library) {
      library = await Library.create({
        user: userId,
        games: [productId]
      });
    } else {
      // Add product if it's not already in the library
      if (!library.games.includes(productId)) {
        library.games.push(productId);
        await library.save();
      }
    }

    // Populate the games field to return full game details
    const populatedLibrary = await Library.findOne({ user: userId }).populate('games');
    res.json(populatedLibrary);
  } catch (error) {
    console.error("Error adding to library:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// NEW: DELETE /api/user/profile - Delete (or anonymize) user account and related data
router.delete('/profile', protect, async (req, res) => {
  const userId = req.user.id;
  try {
    // Anonymize personal information in the User document
    await User.findByIdAndUpdate(userId, {
      name: "Deleted User",
      email: `deleted_${Date.now()}@example.com`,
      password: "",
      username: "",
      phone: "",
      dob: null,
      gender: "",
      address: {},
      securityAnswer: ""
    });

    // Clear wishlist and cart entirely
    await User.findByIdAndUpdate(userId, { wishlist: [], cart: [] });

    // Retain orders but remove user reference
    const Order = require('../models/Order');
    await Order.updateMany({ user: userId }, { $set: { user: null } });

    // Update reviews/ratings if Review model exists (set display to "Deleted User" and remove user reference)
    let Review;
    try {
      Review = require('../models/Review');
      await Review.updateMany({ user: userId }, { $set: { userName: "Deleted User", user: null } });
    } catch (err) {
      console.log("Review model not found, skipping review update.");
    }

    // Remove personal game-related data (e.g., delete user's library)
    await Library.deleteOne({ user: userId });

    res.json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Failed to delete account." });
  }
});

module.exports = router;

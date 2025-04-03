// backend/routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
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
      wishlist: user.wishlist,
      cart: user.cart
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

module.exports = router;

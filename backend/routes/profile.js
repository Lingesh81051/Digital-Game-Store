// backend/routes/profile.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');       // Ensure you have this model
const Library = require('../models/Library');   // Ensure you have this model
let Review;
try {
  Review = require('../models/Review');           // Optional: if you have a Review model
} catch (err) {
  console.log("Review model not found, skipping review updates.");
}
const { protect } = require('../middleware/authMiddleware');

// GET / - fetch current user profile (exclude password)
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT / - update editable fields (username, phone, dob, gender, address, favouritePlace)
router.put('/', protect, async (req, res) => {
  const { username, phone, dob, gender, address, favouritePlace } = req.body;
  
  try {
    // Fetch the current user to merge address fields
    const user = await User.findById(req.user.id);
    
    // Merge existing address with incoming address data
    const currentAddress = user.address ? user.address.toObject() : {};
    const updatedAddress = { ...currentAddress, ...address };

    // Build the update object with merging defaults
    const updateFields = {
      username: username !== undefined ? username : user.username,
      phone: phone !== undefined ? phone : user.phone,
      dob: dob !== undefined ? dob : user.dob,
      gender: gender !== undefined ? gender : user.gender,
      address: updatedAddress,
      favouritePlace: (favouritePlace && favouritePlace.trim() !== '')
                        ? favouritePlace 
                        : user.favouritePlace
    };
    
    console.log("Update fields:", updateFields);
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');
    console.log("Updated user:", updatedUser);
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE / - delete the user account with proper data handling
router.delete('/', protect, async (req, res) => {
  const userId = req.user.id;
  try {
    // Anonymize personal info in the User document
    await User.findByIdAndUpdate(userId, {
      name: "Deleted User",
      email: `deleted_${Date.now()}@example.com`,
      password: "",
      username: "",
      phone: "",
      dob: null,
      gender: "",
      address: {},
      favouritePlace: ""
    });
    
    // Clear wishlist and cart entirely
    await User.findByIdAndUpdate(userId, { wishlist: [], cart: [] });
    
    // Retain orders but remove user reference
    await Order.updateMany({ user: userId }, { $set: { user: null } });
    
    // Update reviews/ratings if Review model exists: show user as "Deleted User" and remove reference
    if (Review) {
      await Review.updateMany({ user: userId }, { $set: { userName: "Deleted User", user: null } });
    }
    
    // Remove personal game-related data by deleting the user's library
    await Library.deleteOne({ user: userId });
    
    res.json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

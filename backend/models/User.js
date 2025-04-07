// backend/models/User.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  country: { type: String, trim: true },  // New field for Country
  pincode: { type: String, trim: true }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },              // Full Name
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true 
  },
  password: { type: String, required: true },
  username: { type: String, trim: true },                           // Optional, editable username
  phone: { type: String, trim: true },                              // Phone Number
  dob: { type: Date },                                              // Date of Birth
  gender: { type: String, trim: true },                             // Gender
  address: addressSchema,                                           // Address with sub-fields, including country
  // Use favouritePlace as the security answer field
  favouritePlace: { type: String, required: true, trim: true },
  isAdmin: { type: Boolean, default: false },
  wishlist: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
  ],
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }
  ],
  lastLogin: { type: Date }
}, { timestamps: true });

// Pre-save hook to normalize favouritePlace for case-insensitive comparisons
userSchema.pre('save', function(next) {
  if (this.favouritePlace) {
    this.favouritePlace = this.favouritePlace.toLowerCase();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);

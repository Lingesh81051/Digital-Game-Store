// backend/models/Library.js
const mongoose = require('mongoose');

const LibrarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Each user has one library
  },
  games: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Library', LibrarySchema);

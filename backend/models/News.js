// backend/models/News.js
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  publishedDate: { type: Date, default: Date.now },
  author: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: "General" } // e.g., Updates, Announcements, etc.
}, { timestamps: true });

// Instead of indexing all fields, only index the following:
newsSchema.index({ title: 'text', description: 'text', author: 'text' });

module.exports = mongoose.model('News', newsSchema);

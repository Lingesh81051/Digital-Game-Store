// backend/routes/news.js
const express = require('express');
const router = express.Router();
const News = require('../models/News');

// GET /api/news - Get all news articles
router.get('/', async (req, res) => {
  try {
    const newsArticles = await News.find().sort({ publishedDate: -1 });
    res.json(newsArticles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching news articles" });
  }
});

// GET /api/news/:id - Get a single news article by ID
router.get('/:id', async (req, res) => {
  try {
    const newsArticle = await News.findById(req.params.id);
    if (!newsArticle) return res.status(404).json({ message: "News article not found" });
    res.json(newsArticle);
  } catch (error) {
    res.status(500).json({ message: "Error fetching the news article" });
  }
});

// POST /api/news - (Optional) Create a news article
router.post('/', async (req, res) => {
  try {
    const newArticle = new News(req.body);
    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    res.status(500).json({ message: "Error creating news article" });
  }
});

// PUT /api/news/:id - (Optional) Update a news article
router.put('/:id', async (req, res) => {
  try {
    const updatedArticle = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedArticle) return res.status(404).json({ message: "News article not found" });
    res.json(updatedArticle);
  } catch (error) {
    res.status(500).json({ message: "Error updating news article" });
  }
});

// DELETE /api/news/:id - (Optional) Delete a news article
router.delete('/:id', async (req, res) => {
  try {
    const deletedArticle = await News.findByIdAndDelete(req.params.id);
    if (!deletedArticle) return res.status(404).json({ message: "News article not found" });
    res.json({ message: "News article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting news article" });
  }
});

module.exports = router;

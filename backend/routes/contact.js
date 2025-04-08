const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); // Ensure you have defined the Contact model

// POST /api/contact - Directly handle Contact Us submissions inline
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Simple validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    // Create a new Contact document
    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });

    // Save the contact data to MongoDB
    const savedContact = await newContact.save();

    res.status(201).json(savedContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

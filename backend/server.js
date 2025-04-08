// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/product')); // Product routes
app.use('/api/news', require('./routes/news')); // News routes
app.use('/api/user/profile', require('./routes/profile')); // Profile routes
app.use('/api/user', require('./routes/user')); // Other user routes
app.use('/api/orders', require('./routes/order')); // Order routes
app.use('/api/user/library', require('./routes/library')); // Library routes
app.use('/api/admin', require('./routes/admin')); // Admin routes

// ✅ Contact Us route
app.use('/api/contact', require('./routes/contact')); // New contact route

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

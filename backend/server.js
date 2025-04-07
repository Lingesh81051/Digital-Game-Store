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

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/product')); // existing product routes
app.use('/api/news', require('./routes/news')); // existing news routes

// Mount profile endpoints under /api/user/profile for profile view/update
// (Make sure you have created a separate "profile.js" route file for profile-specific operations)
app.use('/api/user/profile', require('./routes/profile'));

// Other user-related routes (wishlist, cart, etc.)
app.use('/api/user', require('./routes/user'));
app.use('/api/orders', require('./routes/order')); // order routes
app.use('/api/user/library', require('./routes/library')); // library routes
app.use('/api/admin', require('./routes/admin')); // admin routes

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

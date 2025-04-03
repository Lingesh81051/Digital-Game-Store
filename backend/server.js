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
app.use('/api/products', require('./routes/product')); // your existing product routes
app.use('/api/news', require('./routes/news')); // your existing news routes
app.use('/api/user', require('./routes/user')); // user routes (wishlist, cart, profile)
app.use('/api/orders', require('./routes/order')); // order routes
app.use('/api/user/library', require('./routes/library')); // library routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

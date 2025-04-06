// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

const seedFilePath = path.join(__dirname, '../seeder.js');

// Helper: Update the seed file with the given products array using synchronous file operations
function updateSeedFile(productsArray) {
  try {
    fs.writeFileSync(seedFilePath, JSON.stringify(productsArray, null, 2));
    console.log('Seed file updated successfully');
  } catch (err) {
    console.error('Error writing seed file:', err);
  }
}

// Dashboard route
router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const userCount = await User.countDocuments();
    res.json({ productCount, orderCount, userCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new product
router.post('/products', protect, adminOnly, async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    // Read seed file synchronously and update the products array
    let products = [];
    try {
      const data = fs.readFileSync(seedFilePath, 'utf8');
      products = JSON.parse(data);
    } catch (err) {
      console.error('Error reading or parsing seed file:', err);
    }
    products.push(createdProduct.toObject());
    updateSeedFile(products);
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product route (only update the modified product entry in the seed file)
router.put('/products/:id', protect, adminOnly, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (updatedProduct) {
      // Read seed file synchronously
      let products = [];
      try {
        const data = fs.readFileSync(seedFilePath, 'utf8');
        products = JSON.parse(data);
      } catch (err) {
        console.error('Error reading or parsing seed file:', err);
      }
      // Find the specific product entry and update it
      const index = products.findIndex(p => p._id === req.params.id);
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct.toObject() };
      } else {
        console.warn('Product not found in seed file. Adding new entry.');
        products.push(updatedProduct.toObject());
      }
      updateSeedFile(products);
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('PUT /products/:id error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete product route (remove only the deleted product entry from the seed file)
router.delete('/products/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      // Read seed file synchronously and filter out the deleted product
      let products = [];
      try {
        const data = fs.readFileSync(seedFilePath, 'utf8');
        products = JSON.parse(data);
      } catch (err) {
        console.error('Error reading or parsing seed file:', err);
      }
      const updatedProducts = products.filter(p => p._id !== req.params.id);
      updateSeedFile(updatedProducts);
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('DELETE /products/:id error:', error);
    res.status(500).json({ message: error.message });
  }
});

/* -------------------------
   Order Management Endpoints
   ------------------------- */

// Get all orders (Order List View)
router.get('/orders', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('orderItems.product', 'name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single order details (Order Details View)
router.get('/orders/:id', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('orderItems.product', 'name price image');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (Update Order Status)
router.put('/orders/:id', protect, adminOnly, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (updatedOrder) {
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

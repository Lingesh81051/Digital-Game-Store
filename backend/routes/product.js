// backend/routes/product.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add new product (Admin only – add authentication as needed)
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update product (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE product (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ---------- Comment Endpoints ----------

// GET all comments for a product
router.get('/:id/comments', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product.comments || []);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new comment for a product
router.post('/:id/comments', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      const newComment = {
        id: Date.now().toString(),
        user: req.body.user,
        text: req.body.text,
        likes: 0,
        timestamp: new Date(),
        replies: []
      };
      product.comments = product.comments || [];
      product.comments.push(newComment);
      await product.save();
      res.status(201).json(newComment);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a comment
router.delete('/:id/comments/:commentId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.comments = product.comments.filter(comment => comment.id !== req.params.commentId);
      await product.save();
      res.json({ message: 'Comment deleted' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update (modify) a comment
router.put('/:id/comments/:commentId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      const comment = product.comments.find(comment => comment.id === req.params.commentId);
      if (comment) {
        comment.text = req.body.text;
        await product.save();
        res.json(comment);
      } else {
        res.status(404).json({ message: 'Comment not found' });
      }
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST like a comment
router.post('/:id/comments/:commentId/like', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      const comment = product.comments.find(comment => comment.id === req.params.commentId);
      if (comment) {
        comment.likes += 1;
        await product.save();
        res.json(comment);
      } else {
        res.status(404).json({ message: 'Comment not found' });
      }
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST reply to a comment
router.post('/:id/comments/:commentId/reply', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      const comment = product.comments.find(comment => comment.id === req.params.commentId);
      if (comment) {
        const reply = {
          id: Date.now().toString(),
          user: req.body.user,
          text: req.body.text,
          likes: 0,
          timestamp: new Date()
        };
        comment.replies = comment.replies || [];
        comment.replies.push(reply);
        await product.save();
        res.status(201).json(reply);
      } else {
        res.status(404).json({ message: 'Comment not found' });
      }
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update a reply
router.put('/:id/comments/:commentId/reply/:replyId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const comment = product.comments.find(comment => comment.id === req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const reply = comment.replies.find(reply => reply.id === req.params.replyId);
    if (!reply) return res.status(404).json({ message: 'Reply not found' });

    reply.text = req.body.text;
    await product.save();

    res.json({ message: 'Reply updated', reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a reply
router.delete('/:id/comments/:commentId/reply/:replyId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const comment = product.comments.find(comment => comment.id === req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    comment.replies = comment.replies.filter(reply => reply.id !== req.params.replyId);
    await product.save();

    res.json({ message: 'Reply deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

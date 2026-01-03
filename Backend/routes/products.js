

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Public Marketplace - Get ALL products from ALL stores
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/products/dashboard
// @desc    Admin Dashboard - Get ONLY logged-in admin's products
// @access  Private (Admin Only)
router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    // SECURITY: Filter by the store ID attached to the admin user
    const products = await Product.find({ store: req.user.store }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/products
// @desc    Create a product linked to the admin's store
// @access  Private (Admin Only)
router.post('/', protect, adminOnly, async (req, res) => {
  const { name, price, stock, category, imageUrl, description } = req.body;
  try {
    const product = new Product({
      store: req.user.store, // <--- LINK TO STORE
      name,
      price,
      stock,
      category,
      imageUrl,
      description: description || "No description provided"
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid product data' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (Security check added)
// @access  Private (Admin Only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    // SECURITY CHECK: Ensure admin owns this product
    if (product.store.toString() !== req.user.store.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
    
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product (Security check added)
// @access  Private (Admin Only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  const { name, price, stock, category, description, imageUrl } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    // SECURITY CHECK: Ensure admin owns this product
    if (product.store.toString() !== req.user.store.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this product' });
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.category = category || product.category;
    product.description = description || product.description;
    product.imageUrl = imageUrl || product.imageUrl;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
    
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID (Public)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/products/export/csv
// @desc    Export ONLY admin's store inventory
// @access  Private (Admin)
router.get('/export/csv', protect, adminOnly, async (req, res) => {
  try {
    // Filter by Store ID
    const products = await Product.find({ store: req.user.store }).sort({ createdAt: -1 });

    const fields = ['ID', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Created Date'];
    
    const csvRows = products.map(product => {
      const safeName = product.name ? `"${product.name.replace(/"/g, '""')}"` : '""';
      return [
        product._id,
        safeName,
        product.category,
        product.price,
        product.stock,
        product.stock > 0 ? 'In Stock' : 'Out of Stock',
        new Date(product.createdAt).toLocaleDateString()
      ].join(',');
    });

    const csvString = [fields.join(','), ...csvRows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=store_inventory_${Date.now()}.csv`);
    res.status(200).send(csvString);

  } catch (error) {
    console.error("Export Error:", error);
    res.status(500).json({ message: 'Failed to export data' });
  }
});

module.exports = router;
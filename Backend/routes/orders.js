
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// ==========================================
// 1. STANDARD ORDER ROUTE (COD / Admin)
// ==========================================
router.post('/', protect, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });

    // 1. Decrease Stock
    product.stock = product.stock - quantity;
    await product.save();

    // 2. Create Order
    const order = new Order({
      user: req.user._id,
      store: product.store, // <--- LINK ORDER TO SELLER'S STORE
      customerName: req.user.name, 
      items: [{
        productId: product._id,
        productName: product.name,
        quantity: Number(quantity),
        price: product.price
      }],
      product: product._id, 
      quantity: Number(quantity),
      totalAmount: product.price * quantity,
      status: 'Delivered' 
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (error) {
    console.error("Standard Order Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ==========================================
// 2. MOCK CHECKOUT ROUTE (Pay Online)
// ==========================================
router.post('/checkout', protect, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });

    // 1. Decrease Stock
    product.stock = product.stock - quantity;
    await product.save();

    // 2. Create Order
    const order = new Order({
      user: req.user._id,
      store: product.store, // <--- LINK ORDER TO SELLER'S STORE
      customerName: req.user.name,
      items: [{
        productId: product._id,
        productName: product.name,
        quantity: Number(quantity),
        price: product.price
      }],
      product: product._id, 
      quantity: Number(quantity),
      totalAmount: product.price * quantity,
      status: 'Paid',
      paymentId: `MOCK_PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    await order.save();

    // 3. Simulate Gateway Delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    res.status(201).json({ 
      success: true, 
      orderId: order._id, 
      message: "Payment Verified" 
    });

  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ message: 'Payment Failed' });
  }
});

// ==========================================
// 3. GET ROUTES (My Orders & Admin)
// ==========================================

// @route   GET /api/orders/my-orders
// @desc    Get logged-in user's order history (Across ALL stores)
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('product', 'name imageUrl category price') 
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/orders/admin
// @desc    Get orders for ONE specific store (The logged-in Admin's store)
router.get('/admin', protect, adminOnly, async (req, res) => {
  try {
    // SECURITY: Filter orders by the admin's store ID
    const orders = await Order.find({ store: req.user.store })
      .populate('user', 'name email') 
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

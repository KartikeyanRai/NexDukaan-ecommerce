
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  store: { // <--- NEW FIELD
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: { 
    type: String, 
    required: true 
  },
  // We keep 'items' for the frontend order history list
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      productName: String,
      quantity: Number,
      price: Number
    }
  ],
  // We keep direct 'product' reference for backend logic/population
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled', 'Paid'],
    default: 'Delivered'
  },
  paymentId: {
    type: String,
    required: false 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
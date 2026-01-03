const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  store: { // <--- NEW FIELD
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
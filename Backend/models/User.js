
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['client', 'admin'],
    default: 'client'
  },
  // Store reference for Admins
  store: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store'
  },
  createdAt: { type: Date, default: Date.now }
});

// --- THE FIX IS HERE ---
// 1. We removed 'next' from the parameters (async function() instead of async function(next))
// 2. We use 'return' instead of 'next()'
userSchema.pre('save', async function () {
  // If password is not modified, simply return (promise resolves automatically)
  if (!this.isModified('password')) return;

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
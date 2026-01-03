
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Store = require('../models/Store'); 


// Helper Function to Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user (Client or Admin with Store)
// @access  Public
router.post('/register', async (req, res) => {
  console.log("Register Request Body:", req.body);
  const { name, email, password, role, storeName } = req.body;

  try {
    // 1. Check if User already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // 2. If Admin, Check if Store Name is provided and unique BEFORE creating user
    if (role === 'admin') {
      if (!storeName) {
        return res.status(400).json({ message: 'Store name is required for Store Owners' });
      }
      const storeExists = await Store.findOne({ name: storeName });
      if (storeExists) {
        return res.status(400).json({ message: 'Store name is already taken. Please choose another.' });
      }
    }

    // 3. Create the User
    // Note: We don't save the store ID yet
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // 4. If Admin, Create Store and Link it
    if (role === 'admin') {
      try {
        const store = await Store.create({
          name: storeName,
          owner: user._id
        });

        // Link the new store back to the user
        user.store = store._id;
        await user.save();
      } catch (storeError) {
        // Rollback: If store creation fails (rare), delete the user to prevent "orphan" accounts
        await User.findByIdAndDelete(user._id);
        throw storeError; 
      }
    }

    // 5. Send Response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      store: user.store,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        store: user.store,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ... existing imports
const { protect, adminOnly } = require('../middleware/auth');

// @route   POST /api/auth/add-admin
// @desc    Create a new Co-Admin (Requires Current Admin Password)
// @access  Private (Admin Only)
router.post('/add-admin', protect, adminOnly, async (req, res) => {
  const { name, email, password, currentPassword } = req.body;

  try {
    // 1. Basic Validation
    if (!name || !email || !password || !currentPassword) {
      return res.status(400).json({ message: 'Please provide all fields including your password' });
    }

    // 2. SECURITY CHECK: Verify Current Admin's Identity
    // We fetch the full user (req.user from middleware might lack password if .select('-password') was used)
    const currentAdmin = await User.findById(req.user.id);
    
    if (!currentAdmin || !(await currentAdmin.matchPassword(currentPassword))) {
      return res.status(401).json({ message: 'Invalid current password. Access denied.' });
    }

    // 3. Check if new user email exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // 4. Create the New Admin linked to the SAME store
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
      store: req.user.store 
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: "Co-Admin authorized and added successfully"
    });

  } catch (error) {
    console.error("Add Admin Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/profile', protect, async (req, res) => {
  try {
    // Fetch user and POPULATE the store field to get the name
    const user = await User.findById(req.user.id).populate('store', 'name');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      store: user.store // This will now contain the { name: "..." } object
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
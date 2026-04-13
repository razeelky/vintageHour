const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Cart = require('../models/Cart');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, adminSecret } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Name, email, and password are required.');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      res.status(409);
      throw new Error('An account with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdminSignup =
      role === 'admin' &&
      process.env.ADMIN_SECRET &&
      adminSecret === process.env.ADMIN_SECRET;

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: isAdminSignup ? 'admin' : 'user',
    });

    await Cart.create({ user: user._id, items: [] });

    res.status(201).json({
      message: 'Registration successful.',
      token: generateToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required.');
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password.');
    }

    res.json({
      message: 'Login successful.',
      token: generateToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { registerUser, loginUser, getCurrentUser };

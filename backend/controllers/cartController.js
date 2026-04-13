const Cart = require('../models/Cart');
const Watch = require('../models/Watch');

const calculateCartResponse = (cart) => {
  const items = cart.items.map((item) => ({
    watch: item.watch,
    quantity: item.quantity,
    subtotal: item.watch.price * item.quantity,
  }));

  const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);

  return {
    _id: cart._id,
    user: cart.user,
    items,
    totalPrice,
    updatedAt: cart.updatedAt,
  };
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.watch');

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await Cart.findById(cart._id).populate('items.watch');
  }

  return cart;
};

const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.json(calculateCartResponse(cart));
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { watchId, quantity = 1 } = req.body;

    if (!watchId) {
      res.status(400);
      throw new Error('watchId is required.');
    }

    const watch = await Watch.findById(watchId);

    if (!watch) {
      res.status(404);
      throw new Error('Watch not found.');
    }

    const cart = await getOrCreateCart(req.user._id);
    const existingItem = cart.items.find(
      (item) => item.watch._id.toString() === watchId
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({ watch: watchId, quantity: Number(quantity) || 1 });
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.watch');

    res.status(201).json(calculateCartResponse(updatedCart));
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      res.status(400);
      throw new Error('Quantity must be at least 1.');
    }

    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find(
      (cartItem) => cartItem.watch._id.toString() === req.params.watchId
    );

    if (!item) {
      res.status(404);
      throw new Error('Cart item not found.');
    }

    item.quantity = Number(quantity);
    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.watch');

    res.json(calculateCartResponse(updatedCart));
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    const initialLength = cart.items.length;

    cart.items = cart.items.filter(
      (item) => item.watch._id.toString() !== req.params.watchId
    );

    if (cart.items.length === initialLength) {
      res.status(404);
      throw new Error('Cart item not found.');
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.watch');

    res.json(calculateCartResponse(updatedCart));
  } catch (error) {
    next(error);
  }
};

const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  await cart.save();
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getOrCreateCart,
  calculateCartResponse,
};

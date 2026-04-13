const Order = require('../models/Order');
const { clearCart, getOrCreateCart } = require('./cartController');

const buildOrderFromCart = (cart, userId) => {
  if (!cart.items.length) {
    const error = new Error('Your cart is empty.');
    error.statusCode = 400;
    throw error;
  }

  const items = cart.items.map((item) => ({
    watch: item.watch._id,
    name: item.watch.name,
    brand: item.watch.brand,
    image: item.watch.image,
    price: item.watch.price,
    quantity: item.quantity,
  }));

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    userId,
    items,
    totalPrice,
  };
};

const getUpiConfig = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    const orderData = buildOrderFromCart(cart, req.user._id);
    const upiId = (process.env.UPI_ID || '').trim();
    const payeeName = (process.env.UPI_PAYEE_NAME || 'Vintage Hour').trim();

    if (!upiId) {
      res.status(500);
      throw new Error('UPI_ID is missing on the server.');
    }

    res.json({
      upiId,
      payeeName,
      currency: 'INR',
      amount: orderData.totalPrice,
      note: `Vintage Hour order for ${req.user.name || req.user.email}`,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

const checkout = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    const orderData = buildOrderFromCart(cart, req.user._id);
    const paymentReference = String(req.body.paymentReference || '').trim();

    const order = await Order.create({
      ...orderData,
      status: 'pending',
      paymentMethod: 'upi',
      paymentStatus: paymentReference ? 'submitted' : 'pending',
      paymentReference,
    });

    await clearCart(req.user._id);

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const verifyOrderPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found.');
    }

    order.status = 'paid';
    order.paymentStatus = 'verified';
    await order.save();

    const populatedOrder = await Order.findById(order._id).populate('userId', 'name email role');
    res.json(populatedOrder);
  } catch (error) {
    next(error);
  }
};

const dispatchOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found.');
    }

    if (order.paymentStatus !== 'verified') {
      res.status(400);
      throw new Error('Only verified payments can be marked as dispatched.');
    }

    order.status = 'shipped';
    await order.save();

    const populatedOrder = await Order.findById(order._id).populate('userId', 'name email role');
    res.json(populatedOrder);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUpiConfig,
  checkout,
  getMyOrders,
  getAllOrders,
  verifyOrderPayment,
  dispatchOrder,
};

const express = require('express');
const {
  getUpiConfig,
  checkout,
  getMyOrders,
  getAllOrders,
  verifyOrderPayment,
  dispatchOrder,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/my-orders', getMyOrders);
router.get('/upi-config', getUpiConfig);
router.post('/checkout', checkout);
router.patch('/:id/verify-payment', authorize('admin'), verifyOrderPayment);
router.patch('/:id/dispatch', authorize('admin'), dispatchOrder);
router.get('/', authorize('admin'), getAllOrders);

module.exports = router;

const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/mine', protect, getMyOrders);
router.get('/stats', protect, authorize('admin'), getOrderStats);
router.get('/', protect, authorize('admin'), getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;

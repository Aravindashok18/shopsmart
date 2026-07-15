const express = require('express');
const {
  getUsers,
  updateUserRole,
  deleteUser,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:productId', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);

router.get('/', protect, authorize('admin'), getUsers);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;

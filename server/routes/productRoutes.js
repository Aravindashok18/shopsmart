const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getMyProducts,
  addProductReview,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/seller/mine', protect, authorize('seller', 'admin'), getMyProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorize('seller', 'admin'), createProduct);
router.put('/:id', protect, authorize('seller', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct);
router.post('/:id/reviews', protect, addProductReview);

module.exports = router;

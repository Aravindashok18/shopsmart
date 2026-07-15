const User = require('../models/User');
const Product = require('../models/Product');

// @route GET /api/users (admin)
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/users/:id/role (admin)
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['customer', 'seller', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'role must be customer, seller, or admin' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/users/:id (admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (String(user._id) === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/users/wishlist
const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (err) {
    next(err);
  }
};

// @route POST /api/users/wishlist/:productId
const addToWishlist = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (!req.user.wishlist.some((id) => String(id) === req.params.productId)) {
      req.user.wishlist.push(product._id);
      await req.user.save();
    }
    res.status(201).json(req.user.wishlist);
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/users/wishlist/:productId
const removeFromWishlist = async (req, res, next) => {
  try {
    req.user.wishlist = req.user.wishlist.filter((id) => String(id) !== req.params.productId);
    await req.user.save();
    res.json(req.user.wishlist);
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, updateUserRole, deleteUser, getWishlist, addToWishlist, removeFromWishlist };

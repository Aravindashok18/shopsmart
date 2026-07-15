const Product = require('../models/Product');

// @route GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { keyword, category, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

    const filter = {};
    if (keyword) filter.$text = { $search: keyword };
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const pageNum = Math.max(1, Number(page));
    const pageSize = Math.min(50, Math.max(1, Number(limit)));

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize),
      Product.countDocuments(filter),
    ]);

    res.json({ products, page: pageNum, pages: Math.ceil(total / pageSize), total });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// @route POST /api/products (seller/admin)
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, image, stock } = req.body;
    if (!name || !description || price == null || !category) {
      return res.status(400).json({ message: 'name, description, price, and category are required' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      stock: stock || 0,
      seller: req.user._id,
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/products/:id (owning seller/admin)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (req.user.role !== 'admin' && String(product.seller) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: not your product' });
    }

    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/products/:id (owning seller/admin)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (req.user.role !== 'admin' && String(product.seller) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: not your product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/products/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories.sort());
  } catch (err) {
    next(err);
  }
};

// @route GET /api/products/seller/mine (seller/admin)
const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// @route POST /api/products/:id/reviews
const addProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    if (!rating) return res.status(400).json({ message: 'rating is required' });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const alreadyReviewed = product.reviews.some((r) => String(r.user) === String(req.user._id));
    if (alreadyReviewed) {
      return res.status(409).json({ message: 'You have already reviewed this product' });
    }

    product.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getMyProducts,
  addProductReview,
};

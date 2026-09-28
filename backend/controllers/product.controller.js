const mongoose = require('mongoose');
const Product = require('../models/product.model');

async function createProduct(req, res) {
  const { name, description, price, category, image, stock } = req.body;

  if (!name || !description || !category || !image || price === undefined || stock === undefined) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  if (price <= 0) {
    return res.status(400).json({ success: false, message: 'Price must be greater than 0' });
  }
  if (stock < 0) {
    return res.status(400).json({ success: false, message: 'Stock cannot be negative' });
  }

  try {
    const product = await Product.create({ name, description, price, category, image, stock });
    return res.status(201).json({ success: true, product });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    throw err;
  }
}

async function getProducts(req, res) {
  const { search, category, sort } = req.query;
  const query = {};

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }
  if (category) {
    query.category = category;
  }

  let cursor = Product.find(query);

  if (sort === 'price_asc') {
    cursor = cursor.sort({ price: 1 });
  } else if (sort === 'price_desc') {
    cursor = cursor.sort({ price: -1 });
  }

  const products = await cursor;
  return res.json({ success: true, count: products.length, products });
}

async function getProductById(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID' });
  }

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  return res.json({ success: true, product });
}

module.exports = { createProduct, getProducts, getProductById };

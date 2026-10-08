const mongoose = require('mongoose');
const Product = require('../models/product.model');

const populatedCart = async (user) => {
  await user.populate({
    path: 'cart.product',
    select: 'name price category image stock'
  });
  return user.cart;
};

const validateProductId = (productId, res) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400).json({ success: false, message: 'Invalid product ID' });
    return false;
  }
  return true;
};

async function getCart(req, res) {
  const cart = await populatedCart(req.user);
  return res.json({ success: true, cart });
}

async function addToCart(req, res) {
  const { productId } = req.params;
  if (!validateProductId(productId, res)) return;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const item = req.user.cart.find((entry) => String(entry.product) === productId);
  const quantity = (item?.quantity || 0) + 1;
  if (quantity > product.stock) {
    return res.status(400).json({ success: false, message: 'Requested quantity exceeds stock' });
  }

  if (item) {
    item.quantity = quantity;
  } else {
    req.user.cart.push({ product: productId, quantity: 1 });
  }

  await req.user.save();
  const cart = await populatedCart(req.user);
  return res.json({ success: true, message: 'Cart updated', cart });
}

async function updateCartQuantity(req, res) {
  const { productId } = req.params;
  const { quantity } = req.body;
  if (!validateProductId(productId, res)) return;

  if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ success: false, message: 'Quantity must be a number of at least 1' });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const item = req.user.cart.find((entry) => String(entry.product) === productId);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Product not in cart' });
  }

  if (quantity > product.stock) {
    return res.status(400).json({ success: false, message: 'Requested quantity exceeds stock' });
  }

  item.quantity = quantity;
  await req.user.save();
  const cart = await populatedCart(req.user);
  return res.json({ success: true, message: 'Cart updated', cart });
}

async function removeFromCart(req, res) {
  const { productId } = req.params;
  if (!validateProductId(productId, res)) return;

  const item = req.user.cart.find((entry) => String(entry.product) === productId);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Product not in cart' });
  }

  req.user.cart.pull(item._id);
  await req.user.save();
  const cart = await populatedCart(req.user);
  return res.json({ success: true, message: 'Product removed from cart', cart });
}

module.exports = { getCart, addToCart, updateCartQuantity, removeFromCart };
const mongoose = require("mongoose");
const Product = require("../models/product.model");

async function addToWishlist(req, res) {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID" });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  if (req.user.wishlist.includes(productId)) {
    return res
      .status(409)
      .json({ success: false, message: "Product already in wishlist" });
  }

  req.user.wishlist.push(productId);
  await req.user.save();
  return res
    .status(201)
    .json({ success: true, message: "Product added to wishlist" });
}

async function getWishlist(req, res) {
  const { wishlist } = await req.user.populate({
    path: "wishlist",
    select: "name price category image stock",
  });

  return res.json({ success: true, wishlist });
}

async function removeFromWishlist(req, res) {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID" });
  }

  if (!req.user.wishlist.includes(productId)) {
    return res
      .status(404)
      .json({ success: false, message: "Product not in wishlist" });
  }

  req.user.wishlist.pull(productId);
  await req.user.save();
  return res.json({ success: true, message: "Product removed from wishlist" });
}

module.exports = { addToWishlist, getWishlist, removeFromWishlist };

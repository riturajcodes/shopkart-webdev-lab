const crypto = require("crypto");
const mongoose = require("mongoose");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const razorpay = require("../config/razorpay");

const isValidPhone = (phone) => /^\+?[0-9\s-]{8,15}$/.test(phone);

const normalizeShippingAddress = (shippingAddress) => {
  if (!shippingAddress || typeof shippingAddress !== "object") {
    return { valid: false, message: "Shipping address is required." };
  }

  const normalized = {
    fullName: String(shippingAddress.fullName || "").trim(),
    phone: String(shippingAddress.phone || "").trim(),
    addressLine1: String(shippingAddress.addressLine1 || "").trim(),
    city: String(shippingAddress.city || "").trim(),
    state: String(shippingAddress.state || "").trim(),
    pincode: String(shippingAddress.pincode || "").trim(),
  };

  const requiredFields = [
    "fullName",
    "phone",
    "addressLine1",
    "city",
    "state",
    "pincode",
  ];

  for (const field of requiredFields) {
    if (!normalized[field]) {
      return {
        valid: false,
        message: `${field === "addressLine1" ? "Address line" : field.charAt(0).toUpperCase() + field.slice(1)} is required.`,
      };
    }
  }

  if (!isValidPhone(normalized.phone)) {
    return { valid: false, message: "Phone number is invalid." };
  }

  if (!/^\d{6}$/.test(normalized.pincode)) {
    return { valid: false, message: "Pincode must contain 6 digits." };
  }

  return { valid: true, shippingAddress: normalized };
};

const buildOrderSnapshot = async (user) => {
  if (!user.cart || user.cart.length === 0) {
    return { error: "Your cart is empty." };
  }

  const items = [];
  let totalAmount = 0;

  for (const cartItem of user.cart) {
    if (!cartItem || !cartItem.product) {
      return { error: "One or more cart items are invalid." };
    }

    const productId = cartItem.product._id
      ? cartItem.product._id
      : cartItem.product;
    const product = await Product.findById(productId);

    if (!product) {
      return { error: "One or more products are no longer available." };
    }

    if (cartItem.quantity > product.stock) {
      return { error: `Insufficient stock for ${product.name}.` };
    }

    const itemSnapshot = {
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: cartItem.quantity,
      image: product.image,
    };

    items.push(itemSnapshot);
    totalAmount += product.price * cartItem.quantity;
  }

  return { items, totalAmount };
};

async function createPaymentOrder(req, res) {
  try {
    const addressCheck = normalizeShippingAddress(req.body.shippingAddress);
    if (!addressCheck.valid) {
      return res
        .status(400)
        .json({ success: false, message: addressCheck.message });
    }

    const user = await req.user.populate({
      path: "cart.product",
      select: "_id name price image stock",
    });

    const snapshot = await buildOrderSnapshot(user);
    if (snapshot.error) {
      return res.status(400).json({ success: false, message: snapshot.error });
    }

    const order = await Order.create({
      user: req.user._id,
      items: snapshot.items,
      shippingAddress: addressCheck.shippingAddress,
      totalAmount: snapshot.totalAmount,
      paymentStatus: "PENDING",
      status: "PENDING_PAYMENT",
    });

    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: "Razorpay is not configured on the server.",
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(snapshot.totalAmount * 100),
      currency: "INR",
      receipt: order._id.toString(),
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return res.json({
      success: true,
      message: "Order ready for payment.",
      shopKartOrderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: Math.round(snapshot.totalAmount * 100),
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to create payment order." });
  }
}

async function verifyPayment(req, res) {
  try {
    const {
      shopKartOrderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !shopKartOrderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Missing payment verification details.",
        });
    }

    const order = await Order.findById(shopKartOrderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    if (String(order.user) !== String(req.user._id)) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You are not allowed to access this order.",
        });
    }

    if (!order.razorpayOrderId || order.razorpayOrderId !== razorpay_order_id) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Razorpay order reference." });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${order.razorpayOrderId}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature." });
    }

    order.paymentStatus = "PAID";
    order.status = "PLACED";
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    req.user.cart = [];
    await req.user.save();

    return res.json({
      success: true,
      message: "Payment verified and order placed.",
      order,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to verify payment." });
  }
}

async function getOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    return res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to fetch orders." });
  }
}

async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    const order = await Order.findOne({ _id: id, user: req.user._id });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    return res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to fetch order." });
  }
}

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getOrders,
  getOrderById,
};

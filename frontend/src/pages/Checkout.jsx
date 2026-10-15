import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createPaymentOrder, verifyPayment } from "../services/api";

const initialAddress = {
  fullName: "",
  phone: "",
  addressLine1: "",
  city: "",
  state: "",
  pincode: "",
};

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const validateAddress = (shippingAddress) => {
  const nextErrors = {};
  const fields = {
    fullName: "Full Name",
    phone: "Phone",
    addressLine1: "Address",
    city: "City",
    state: "State",
    pincode: "Pincode",
  };

  Object.entries(fields).forEach(([key, label]) => {
    const value = String(shippingAddress[key] || "").trim();
    if (!value) {
      nextErrors[key] = `${label} is required.`;
    }
  });

  if (
    shippingAddress.phone &&
    !/^\+?[0-9\s-]{8,15}$/.test(shippingAddress.phone.trim())
  ) {
    nextErrors.phone = "Phone number is invalid.";
  }

  if (
    shippingAddress.pincode &&
    !/^\d{6}$/.test(shippingAddress.pincode.trim())
  ) {
    nextErrors.pincode = "Pincode must contain 6 digits.";
  }

  return nextErrors;
};

const loadRazorpayScript = async () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState(initialAddress);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const items = cartItems.filter((item) => item.product);
  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePayment = async (data) => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded || !window.Razorpay) {
      throw new Error("Razorpay checkout is unavailable right now.");
    }

    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      name: "ShopKart",
      description: "ShopKart Order",
      order_id: data.razorpayOrderId,
      handler: async function (paymentResponse) {
        try {
          const verification = await verifyPayment({
            shopKartOrderId: data.shopKartOrderId,
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
          });

          clearCart();
          navigate(
            `/order-success/${verification.order?._id || data.shopKartOrderId}`,
          );
        } catch (error) {
          setSubmitError(
            error.response?.data?.message ||
              "Payment verification failed. Please try again.",
          );
        }
      },
      prefill: {
        name: shippingAddress.fullName,
        contact: shippingAddress.phone,
      },
      theme: {
        color: "#111111",
      },
      modal: {
        ondismiss: () => {
          setSubmitError("Payment was cancelled. Your cart remains unchanged.");
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", function (response) {
      setSubmitError(
        response.error?.description || "Payment failed. Please try again.",
      );
    });

    paymentObject.open();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateAddress(shippingAddress);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitError("");
      return;
    }

    setPlacingOrder(true);
    setSubmitError("");

    try {
      const data = await createPaymentOrder(shippingAddress);
      await handlePayment(data);
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
          "Unable to create your order. Please try again.",
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="state-message">
        <h1>Your cart is empty</h1>
        <p>Choose at least one product before checkout.</p>
        <button className="btn-black" onClick={() => navigate("/products")}>
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      {submitError && <div className="alert alert-error">{submitError}</div>}

      <form className="checkout-layout" onSubmit={handleSubmit}>
        <section className="checkout-form-panel">
          <h2>Shipping Details</h2>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              value={shippingAddress.fullName}
              onChange={handleChange}
            />
            {errors.fullName && (
              <span className="field-error">{errors.fullName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              value={shippingAddress.phone}
              onChange={handleChange}
            />
            {errors.phone && (
              <span className="field-error">{errors.phone}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="addressLine1">Address</label>
            <input
              id="addressLine1"
              name="addressLine1"
              value={shippingAddress.addressLine1}
              onChange={handleChange}
            />
            {errors.addressLine1 && (
              <span className="field-error">{errors.addressLine1}</span>
            )}
          </div>

          <div className="field-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                value={shippingAddress.city}
                onChange={handleChange}
              />
              {errors.city && (
                <span className="field-error">{errors.city}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                id="state"
                name="state"
                value={shippingAddress.state}
                onChange={handleChange}
              />
              {errors.state && (
                <span className="field-error">{errors.state}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pincode">Pincode</label>
            <input
              id="pincode"
              name="pincode"
              value={shippingAddress.pincode}
              onChange={handleChange}
            />
            {errors.pincode && (
              <span className="field-error">{errors.pincode}</span>
            )}
          </div>
        </section>

        <aside className="checkout-summary-panel">
          <h2>Order Summary</h2>
          <div className="summary-list">
            {items.map(({ product, quantity }) => (
              <div className="summary-row" key={product._id}>
                <span>
                  {product.name} × {quantity}
                </span>
                <strong>{formatCurrency(product.price * quantity)}</strong>
              </div>
            ))}
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>

          <button type="submit" className="btn-black" disabled={placingOrder}>
            {placingOrder ? "Preparing Order..." : "Place Order"}
          </button>
        </aside>
      </form>
    </div>
  );
};

export default Checkout;

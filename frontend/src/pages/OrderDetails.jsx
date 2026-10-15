import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../services/api";

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const OrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        if (isMounted) {
          setOrder(data.order);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Unable to load this order.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrder();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <div className="state-message">Loading order details...</div>;
  }

  if (error) {
    return (
      <div className="state-message error-message">
        <p>{error}</p>
        <button className="btn-black" onClick={() => navigate("/orders")}>
          Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="order-details-page">
      <h1>Order #{order._id.slice(-8)}</h1>
      <div className="order-meta">
        <p>
          {new Date(order.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
        <p>Status: {order.status}</p>
      </div>

      <div className="order-details-card">
        <h2>Items</h2>
        {order.items.map((item) => (
          <div className="order-line-item" key={`${order._id}-${item.product}`}>
            <div>
              <strong>{item.name}</strong>
              <span>Qty: {item.quantity}</span>
            </div>
            <strong>{formatCurrency(item.price * item.quantity)}</strong>
          </div>
        ))}
      </div>

      <div className="order-shipping-card">
        <h2>Shipping Details</h2>
        <p>{order.shippingAddress?.fullName}</p>
        <p>{order.shippingAddress?.addressLine1}</p>
        <p>
          {order.shippingAddress?.city}, {order.shippingAddress?.state}
        </p>
        <p>{order.shippingAddress?.pincode}</p>
        <p>Phone: {order.shippingAddress?.phone}</p>
      </div>

      <div className="order-total-card">
        <span>Total</span>
        <strong>{formatCurrency(order.totalAmount)}</strong>
      </div>

      <div className="order-actions">
        <button className="btn-black" onClick={() => navigate("/orders")}>
          Back to Orders
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;

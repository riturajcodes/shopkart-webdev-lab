import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../services/api";

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        if (isMounted) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              "Unable to load your orders right now.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="state-message">Loading your orders...</div>;
  }

  if (error) {
    return (
      <div className="state-message error-message">
        <p>{error}</p>
        <button className="btn-black" onClick={() => navigate("/products")}>
          Back to Shop
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="state-message">
        <h1>My Orders</h1>
        <p>You have not placed any orders yet.</p>
        <button className="btn-black" onClick={() => navigate("/products")}>
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <article className="order-card" key={order._id}>
            <div className="order-header">
              <div>
                <p className="order-label">Order #{order._id.slice(-8)}</p>
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span className="order-status">{order.status}</span>
            </div>

            <div className="order-items-preview">
              {order.items.slice(0, 2).map((item) => (
                <span key={`${order._id}-${item.product}`}>
                  {item.name} × {item.quantity}
                </span>
              ))}
              {order.items.length > 2 && (
                <span>+ {order.items.length - 2} more</span>
              )}
            </div>

            <div className="order-footer">
              <strong>Total: {formatCurrency(order.totalAmount)}</strong>
              <button
                className="btn-outline"
                onClick={() => navigate(`/orders/${order._id}`)}
              >
                View Details
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Orders;

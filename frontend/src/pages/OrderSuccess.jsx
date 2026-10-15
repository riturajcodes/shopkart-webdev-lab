import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../services/api";

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
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
          setError(
            err.response?.data?.message || "Unable to load your recent order.",
          );
        }
      }
    };

    fetchOrder();
    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <div className="success-shell">
      <div className="success-card">
        <div className="success-badge">✓</div>
        <h1>Order Placed Successfully</h1>

        {error ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          <>
            <p>
              <strong>Order ID:</strong> {order?._id || id}
            </p>
            <p>
              <strong>Total:</strong>{" "}
              {order ? formatCurrency(order.totalAmount) : "—"}
            </p>
            <p>
              <strong>Status:</strong> {order?.status || "PLACED"}
            </p>
            <p>Your order has been saved successfully.</p>
          </>
        )}

        <div className="success-actions">
          <button className="btn-black" onClick={() => navigate("/orders")}>
            View My Orders
          </button>
          <button className="btn-outline" onClick={() => navigate("/products")}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

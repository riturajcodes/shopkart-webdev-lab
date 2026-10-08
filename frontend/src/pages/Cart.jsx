import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, cartItemCount, cartLoading, cartError, refreshCart, updateQuantity, removeItem } = useCart();
  const [busyProduct, setBusyProduct] = useState('');
  const [actionError, setActionError] = useState('');
  const items = cartItems.filter((item) => item.product);
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const runAction = async (productId, action) => {
    setBusyProduct(productId);
    setActionError('');
    try {
      await action();
    } catch (error) {
      setActionError(error.response?.data?.message || 'Unable to update your cart. Please try again.');
    } finally {
      setBusyProduct('');
    }
  };

  if (cartLoading) return <div className="state-message">Loading your cart...</div>;

  if (cartError) {
    return (
      <div className="state-message error-message">
        <p>{cartError}</p>
        <button className="btn-black" onClick={refreshCart}>Try Again</button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="state-message">
        <h1>Your cart is empty</h1>
        <p>Looks like you haven't added anything yet.</p>
        <button className="btn-black" onClick={() => navigate('/products')}>Browse Products</button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>My Cart</h1>
      {actionError && <div className="alert alert-error">{actionError}</div>}
      <div className="cart-layout">
        <section className="cart-items" aria-label="Cart items">
          {items.map(({ product, quantity }) => (
            <article className="cart-item" key={product._id}>
              <img src={product.image} alt={product.name} />
              <div className="cart-item-info">
                <div className="product-brand">{product.category}</div>
                <h2>{product.name}</h2>
                <p>₹{product.price.toLocaleString('en-IN')} each</p>
                <div className="cart-controls">
                  <button
                    aria-label={`Decrease ${product.name} quantity`}
                    disabled={busyProduct === product._id || quantity <= 1}
                    onClick={() => runAction(product._id, () => updateQuantity(product._id, quantity - 1))}
                  >−</button>
                  <span>{quantity}</span>
                  <button
                    aria-label={`Increase ${product.name} quantity`}
                    disabled={busyProduct === product._id || quantity >= product.stock}
                    onClick={() => runAction(product._id, () => updateQuantity(product._id, quantity + 1))}
                  >+</button>
                  <button
                    className="cart-remove"
                    disabled={busyProduct === product._id}
                    onClick={() => runAction(product._id, () => removeItem(product._id))}
                  >Remove</button>
                </div>
              </div>
              <strong className="cart-line-total">₹{(product.price * quantity).toLocaleString('en-IN')}</strong>
            </article>
          ))}
        </section>
        <aside className="cart-summary">
          <h2>Order Summary</h2>
          <div><span>Items</span><span>{cartItemCount}</span></div>
          <div className="cart-subtotal"><span>Subtotal</span><strong>₹{subtotal.toLocaleString('en-IN')}</strong></div>
          <button className="btn-black" disabled>Proceed to Checkout</button>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
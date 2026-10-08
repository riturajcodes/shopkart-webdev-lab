import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  addToCart as addToCartRequest,
  getCart,
  removeFromCart as removeFromCartRequest,
  updateCartQuantity as updateCartQuantityRequest
} from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ user, children }) => {
  const userId = user?._id;
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(Boolean(user));
  const [cartError, setCartError] = useState('');

  const refreshCart = useCallback(async () => {
    if (!userId) {
      setCartItems([]);
      setCartError('');
      setCartLoading(false);
      return;
    }

    setCartLoading(true);
    setCartError('');
    try {
      const data = await getCart();
      setCartItems(data.cart || []);
    } catch (error) {
      setCartError('Unable to load your cart.');
    } finally {
      setCartLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setCartItems([]);
      setCartError('');
      setCartLoading(false);
      return;
    }
    refreshCart();
  }, [userId, refreshCart]);

  const addItem = async (productId) => {
    const data = await addToCartRequest(productId);
    setCartItems(data.cart || []);
  };

  const updateQuantity = async (productId, quantity) => {
    const data = await updateCartQuantityRequest(productId, quantity);
    setCartItems(data.cart || []);
  };

  const removeItem = async (productId) => {
    const data = await removeFromCartRequest(productId);
    setCartItems(data.cart || []);
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartItemCount,
      cartLoading,
      cartError,
      refreshCart,
      addItem,
      updateQuantity,
      removeItem
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
};
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToWishlist } from '../services/api';

const WISHLIST_LABEL = {
  idle: '♡ Add to Wishlist',
  saving: '⏳ Saving...',
  saved: '♥ Added to Wishlist'
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const inStock = product.stock > 0;

  const handleWishlist = async () => {
    setStatus('saving');
    setError('');
    try {
      await addToWishlist(product._id);
      setStatus('saved');
    } catch (err) {
      const code = err.response?.status;
      if (code === 409) {
        setStatus('saved');
        return;
      }
      setStatus('idle');
      setError(code === 401 ? 'Please login to save products.' : 'Unable to save product. Please try again.');
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-brand">{product.category}</div>
      <div className="product-name">{product.name}</div>
      <div className="product-price">₹{product.price.toLocaleString('en-IN')}</div>
      <div className={`stock-status${inStock ? '' : ' out-of-stock'}`}>
        {inStock ? `${product.stock} units left` : 'Out of stock'}
      </div>
      <button className="btn-black" onClick={() => navigate(`/products/${product._id}`)}>
        View Details
      </button>
      <button className="btn-outline" onClick={handleWishlist} disabled={status !== 'idle'}>
        {WISHLIST_LABEL[status]}
      </button>
      {error && <div className="field-error">{error}</div>}
    </div>
  );
};

export default ProductCard;

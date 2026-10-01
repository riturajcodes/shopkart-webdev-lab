import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WishlistCard = ({ product, onRemove }) => {
  const navigate = useNavigate();
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState('');
  const inStock = product.stock > 0;

  const handleRemove = async () => {
    setRemoving(true);
    setError('');
    try {
      await onRemove(product._id);
    } catch (err) {
      setRemoving(false);
      setError('Unable to remove product. Please try again.');
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
      <button className="btn-outline" onClick={handleRemove} disabled={removing}>
        {removing ? 'Removing...' : 'Remove ♥'}
      </button>
      {error && <div className="field-error">{error}</div>}
    </div>
  );
};

export default WishlistCard;

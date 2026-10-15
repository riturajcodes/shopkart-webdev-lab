import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { addToWishlist } from '../services/api';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../constants';
import { HeartIcon } from './Icons';

const LOW_STOCK_THRESHOLD = 10;

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= LOW_STOCK_THRESHOLD;
  const detailsPath = `/products/${product._id}`;

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

  const handleAddToCart = async () => {
    setAdding(true);
    setError('');
    try {
      await addItem(product._id);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } catch (err) {
      setError(err.response?.status === 401 ? 'Please login to add products to your cart.' : 'Unable to add product to cart.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <Link to={detailsPath} className="product-image-link" aria-label={`View ${product.name}`}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>

        {!inStock && <span className="product-badge badge-sold-out">Sold out</span>}
        {lowStock && <span className="product-badge badge-low">Only {product.stock} left</span>}

        <button
          type="button"
          className={`wishlist-btn${status === 'saved' ? ' saved' : ''}`}
          onClick={handleWishlist}
          disabled={status !== 'idle'}
          aria-label={status === 'saved' ? 'Saved to wishlist' : 'Add to wishlist'}
        >
          <HeartIcon width={20} height={20} />
        </button>

        <button
          type="button"
          className="quick-add"
          onClick={handleAddToCart}
          disabled={adding || !inStock}
        >
          {!inStock ? 'Sold out' : adding ? 'Adding...' : added ? 'Added to bag ✓' : 'Add to bag'}
        </button>
      </div>

      <div className="product-meta">
        <Link to={detailsPath} className="product-name">{product.name}</Link>
        <div className="product-price">{formatPrice(product.price)}</div>
      </div>
      {error && <div className="field-error">{error}</div>}
    </div>
  );
};

export default ProductCard;

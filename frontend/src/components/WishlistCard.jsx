import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../constants';
import { CloseIcon } from './Icons';

const WishlistCard = ({ product, onRemove }) => {
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState('');
  const inStock = product.stock > 0;
  const detailsPath = `/products/${product._id}`;

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
        <Link to={detailsPath} className="product-image-link" aria-label={`View ${product.name}`}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
        {!inStock && <span className="product-badge badge-sold-out">Sold out</span>}
        <button
          type="button"
          className="wishlist-btn"
          onClick={handleRemove}
          disabled={removing}
          aria-label={`Remove ${product.name} from wishlist`}
        >
          <CloseIcon width={18} height={18} />
        </button>
        <Link to={detailsPath} className="quick-add">
          View details
        </Link>
      </div>

      <div className="product-meta">
        <Link to={detailsPath} className="product-name">{product.name}</Link>
        <div className="product-price">{formatPrice(product.price)}</div>
      </div>
      {error && <div className="field-error">{error}</div>}
    </div>
  );
};

export default WishlistCard;

import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WishlistCard from '../components/WishlistCard';
import { getWishlist, removeFromWishlist } from '../services/api';

const Wishlist = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getWishlist();
      setItems(data.wishlist || []);
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Please login to view your wishlist.'
          : "We couldn't load your wishlist."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
    setItems((prev) => prev.filter((product) => product._id !== productId));
  };

  if (loading) {
    return <div className="state-message">Loading your wishlist...</div>;
  }

  if (error) {
    return (
      <div className="state-message error-message">
        <p>Something went wrong.</p>
        <p>{error}</p>
        <button className="btn-black" onClick={fetchWishlist}>Try Again</button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="state-message">
        <p>❤️</p>
        <p>Your wishlist is empty</p>
        <p>Save products you love and find them here later.</p>
        <button className="btn-black" onClick={() => navigate('/products')}>Browse Products</button>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p>{items.length} {items.length === 1 ? 'product' : 'products'} saved</p>
      </div>
      <div className="product-grid">
        {items.map((product) => (
          <WishlistCard key={product._id} product={product} onRemove={handleRemove} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;

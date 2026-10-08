import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [cartError, setCartError] = useState('');

  const handleAddToCart = async () => {
    setAdding(true);
    setCartError('');
    try {
      await addItem(product._id);
    } catch (err) {
      setCartError(err.response?.status === 401 ? 'Please login to add this product.' : 'Unable to add product to cart.');
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getProductById(id);
        if (isMounted) setProduct(data.product);
      } catch (err) {
        if (isMounted) setError('Something went wrong while loading this product.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <div className="state-message">Loading product...</div>;
  }

  if (error) {
    return <div className="state-message error-message">{error}</div>;
  }

  if (!product) {
    return <div className="state-message">Product not found.</div>;
  }

  const inStock = product.stock > 0;

  return (
    <div className="product-details">
      <button className="back-link" onClick={() => navigate('/products')}>
        ← Back to Products
      </button>

      <div className="product-details-grid">
        <div className="product-details-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-details-info">
          <div className="product-brand">{product.category}</div>
          <h1>{product.name}</h1>
          <div className="product-price">₹{product.price.toLocaleString('en-IN')}</div>
          <p className="product-description">{product.description}</p>
          <div className={`stock-status${inStock ? '' : ' out-of-stock'}`}>
            {inStock ? `${product.stock} units left` : 'Out of stock'}
          </div>
          <button className="btn-black" onClick={handleAddToCart} disabled={!inStock || adding}>
            {!inStock ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
          </button>
          {cartError && <div className="field-error">{cartError}</div>}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

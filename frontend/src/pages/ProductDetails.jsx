import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { addToWishlist, getProductById, getProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../constants';
import { ReturnIcon, ShieldIcon, TruckIcon } from '../components/Icons';

const RELATED_LIMIT = 4;

const ProductDetails = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [cartError, setCartError] = useState('');
  const [wishlistState, setWishlistState] = useState('idle');

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

  const handleWishlist = async () => {
    setWishlistState('saving');
    setCartError('');
    try {
      await addToWishlist(product._id);
      setWishlistState('saved');
    } catch (err) {
      const code = err.response?.status;
      if (code === 409) {
        setWishlistState('saved');
        return;
      }
      setWishlistState('idle');
      setCartError(code === 401 ? 'Please login to save this product.' : 'Unable to save product. Please try again.');
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      setWishlistState('idle');
      setCartError('');
      try {
        const data = await getProductById(id);
        if (!isMounted) return;
        setProduct(data.product);

        try {
          const relatedData = await getProducts({ category: data.product.category });
          if (isMounted) {
            setRelated(
              (relatedData.products || [])
                .filter((item) => item._id !== data.product._id)
                .slice(0, RELATED_LIMIT)
            );
          }
        } catch (relatedErr) {
          if (isMounted) setRelated([]);
        }
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
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`}>{product.category}</Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>

      <div className="product-details-grid">
        <div className="product-details-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-details-info">
          <div className="product-brand">{product.category}</div>
          <h1>{product.name}</h1>
          <div className="product-price">{formatPrice(product.price)}</div>
          <div className={`stock-status${inStock ? '' : ' out-of-stock'}`}>
            {inStock
              ? product.stock <= 10
                ? `Hurry, only ${product.stock} left`
                : 'In stock'
              : 'Out of stock'}
          </div>
          <p className="product-description">{product.description}</p>

          <div className="product-actions">
            <button className="btn-black" onClick={handleAddToCart} disabled={!inStock || adding}>
              {!inStock ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Bag'}
            </button>
            <button
              className="btn-outline"
              onClick={handleWishlist}
              disabled={wishlistState !== 'idle'}
            >
              {wishlistState === 'saved' ? '♥ Saved' : 'Save to Wishlist'}
            </button>
          </div>
          {cartError && <div className="field-error">{cartError}</div>}

          <ul className="product-perks">
            <li>
              <TruckIcon width={20} height={20} /> Fast, tracked delivery
            </li>
            <li>
              <ReturnIcon width={20} height={20} /> Easy 7-day returns
            </li>
            <li>
              <ShieldIcon width={20} height={20} /> Secure checkout
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="related-products">
          <h2 className="related-title">You may also like</h2>
          <div className="product-grid">
            {related.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;

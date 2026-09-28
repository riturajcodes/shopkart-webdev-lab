import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';

const FEATURED_LIMIT = 8;

const Landing = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchFeatured = async () => {
      try {
        const data = await getProducts();
        if (isMounted) setProducts((data.products || []).slice(0, FEATURED_LIMIT));
      } catch (err) {
        if (isMounted) setError('Something went wrong while loading products.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="landing">
      <section className="hero">
        <h1 className="hero-title">
          DEFINE
          <br />
          YOUR STYLE.
        </h1>
        <p className="hero-subtitle">
          Curated essentials for the modern wardrobe, delivered to your door.
        </p>
        <button className="btn-outline" onClick={() => navigate('/products')}>
          Shop All Products
        </button>
      </section>

      <section className="landing-products">
        <div className="section-title">FEATURED PRODUCTS</div>

        {loading && <div className="state-message">Loading products...</div>}

        {!loading && error && (
          <div className="state-message error-message">{error}</div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="state-message">No products found.</div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <button className="btn-black view-more-btn" onClick={() => navigate('/products')}>
              View More
            </button>
          </>
        )}
      </section>
    </div>
  );
};

export default Landing;

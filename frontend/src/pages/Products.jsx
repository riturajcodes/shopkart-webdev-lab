import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { getProducts } from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (search) params.search = search;
        if (category) params.category = category;

        const data = await getProducts(params);
        if (isMounted) setProducts(data.products || []);
      } catch (err) {
        if (isMounted) setError('Something went wrong while loading products.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchProducts, 300);
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [search, category]);

  return (
    <div className="home-container">
      <div className="section-title">ALL PRODUCTS</div>

      <SearchBar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
      />

      {loading && <div className="state-message">Loading products...</div>}

      {!loading && error && (
        <div className="state-message error-message">{error}</div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="state-message">No products found.</div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;

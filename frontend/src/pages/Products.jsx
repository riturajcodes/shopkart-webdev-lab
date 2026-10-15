import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { getProducts } from '../services/api';

const sorters = {
  featured: null,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'name-asc': (a, b) => a.name.localeCompare(b.name),
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const updateParam = (key, value, options) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, options);
  };

  const setCategory = (value) => updateParam('category', value);
  const setSearch = (value) => updateParam('search', value, { replace: true });

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

  const sorted = useMemo(() => {
    const compare = sorters[sort];
    return compare ? [...products].sort(compare) : products;
  }, [products, sort]);

  const title = category || (search ? `Results for "${search}"` : 'New In');

  return (
    <div className="home-container">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>{category || 'All Products'}</span>
      </nav>

      <div className="listing-header">
        <h1 className="listing-title">{title}</h1>
        {!loading && !error && (
          <span className="listing-count">
            {sorted.length} {sorted.length === 1 ? 'product' : 'products'}
          </span>
        )}
      </div>

      <SearchBar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
      />

      {loading && <div className="state-message">Loading products...</div>}

      {!loading && error && (
        <div className="state-message error-message">{error}</div>
      )}

      {!loading && !error && sorted.length === 0 && (
        <div className="state-message">No products found.</div>
      )}

      {!loading && !error && sorted.length > 0 && (
        <div className="product-grid">
          {sorted.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;

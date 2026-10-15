import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';
import {
  ArrowRightIcon,
  ChatIcon,
  ReturnIcon,
  ShieldIcon,
  TruckIcon,
} from '../components/Icons';

const NEW_ARRIVALS_LIMIT = 8;
const TRENDING_LIMIT = 4;

const unsplash = (id, width = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

const HERO_VIDEO = `${process.env.PUBLIC_URL}/hero.mp4`;

const CATEGORY_TILES = [
  { name: 'Fashion', image: unsplash('1490481651871-ab68de25d43d', 900) },
  { name: 'Electronics', image: unsplash('1498049794561-7780e7231661', 900) },
  { name: 'Home', image: unsplash('1524758631624-e2822e304c36', 900) },
  { name: 'Books', image: unsplash('1512820790803-83ca734da794', 900) },
];

const PROMO_BANNERS = [
  {
    eyebrow: 'The Fashion Edit',
    title: 'Fresh fits for every day',
    cta: 'Discover',
    to: '/products?category=Fashion',
    image: unsplash('1445205170230-053b83016050', 1200),
  },
  {
    eyebrow: 'Tech Essentials',
    title: 'Upgrade your setup',
    cta: 'Discover',
    to: '/products?category=Electronics',
    image: unsplash('1550009158-9ebf69173e03', 1200),
  },
];

const PERKS = [
  { Icon: TruckIcon, title: 'Fast Delivery', text: 'Quick dispatch, tracked to your door' },
  { Icon: ReturnIcon, title: 'Easy Returns', text: '7-day hassle-free returns' },
  { Icon: ShieldIcon, title: 'Secure Payments', text: 'Safe, encrypted checkout' },
  { Icon: ChatIcon, title: 'Client Care', text: "We're here when you need us" },
];

const ProductSection = ({ title, subtitle, linkTo, linkLabel, products }) => (
  <section className="home-section container">
    <div className="section-heading">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
    <div className="section-footer">
      <Link to={linkTo} className="section-link">
        {linkLabel} <ArrowRightIcon width={16} height={16} />
      </Link>
    </div>
  </section>
);

const Landing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchFeatured = async () => {
      try {
        const data = await getProducts();
        if (isMounted) setProducts(data.products || []);
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

  const newArrivals = products.slice(0, NEW_ARRIVALS_LIMIT);
  const trending = products.slice(NEW_ARRIVALS_LIMIT, NEW_ARRIVALS_LIMIT + TRENDING_LIMIT);

  return (
    <div className="landing">
      <section className="hero">
        <video
          className="hero-video"
          src={HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-eyebrow">Autumn / Winter 2026</span>
          <h1 className="hero-title">
            Define
            <br />
            <em>your style</em>
          </h1>
          <div className="hero-actions">
            <Link to="/products?category=Fashion" className="btn-white">
              Shop Fashion
            </Link>
            <Link to="/products" className="hero-link">
              View all
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section container">
        <div className="section-heading">
          <h2>The collections</h2>
        </div>
        <div className="category-tiles">
          {CATEGORY_TILES.map((tile) => (
            <Link
              key={tile.name}
              to={`/products?category=${tile.name}`}
              className="category-tile"
            >
              <span className="category-tile-media">
                <span style={{ backgroundImage: `url(${tile.image})` }} />
              </span>
              <span className="category-tile-label">
                {tile.name}
                <ArrowRightIcon width={16} height={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {loading && <div className="state-message">Loading products...</div>}
      {!loading && error && <div className="state-message error-message">{error}</div>}

      {!loading && !error && newArrivals.length > 0 && (
        <ProductSection
          title="New arrivals"
          subtitle="The latest pieces, just landed"
          linkTo="/products"
          linkLabel="View all"
          products={newArrivals}
        />
      )}

      <section className="promo-banners container">
        {PROMO_BANNERS.map((banner) => (
          <Link key={banner.title} to={banner.to} className="promo-banner">
            <span
              className="promo-banner-bg"
              style={{ backgroundImage: `url(${banner.image})` }}
            />
            <div className="promo-banner-content">
              <span className="hero-eyebrow">{banner.eyebrow}</span>
              <h3>{banner.title}</h3>
              <span className="btn-white">{banner.cta}</span>
            </div>
          </Link>
        ))}
      </section>

      {!loading && !error && trending.length > 0 && (
        <ProductSection
          title="Most wanted"
          subtitle="What everyone is adding to their bag"
          linkTo="/products"
          linkLabel="Shop more"
          products={trending}
        />
      )}

      <section className="perks">
        <div className="container perks-grid">
          {PERKS.map(({ Icon, title, text }) => (
            <div className="perk" key={title}>
              <Icon width={26} height={26} />
              <h4>{title}</h4>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;

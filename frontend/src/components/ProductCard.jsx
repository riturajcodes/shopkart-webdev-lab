import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const inStock = product.stock > 0;

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
    </div>
  );
};

export default ProductCard;

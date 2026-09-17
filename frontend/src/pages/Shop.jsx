import React from 'react';

const DEMO_PRODUCTS = [
  { id: 1, brand: 'ACNE STUDIOS', name: 'OVERSIZED BLAZER', price: '$850' },
  { id: 2, brand: 'BOTTEGA VENETA', name: 'CASSETTE BAG', price: '$3,500' },
  { id: 3, brand: 'THE ROW', name: 'ZIPPED BOOT', price: '$1,490' },
  { id: 4, brand: 'JIL SANDER', name: 'TAILORED SHIRT', price: '$590' },
  { id: 5, brand: 'SAINT LAURENT', name: 'LEATHER JACKET', price: '$4,990' },
  { id: 6, brand: 'KHAITE', name: 'CASHMERE CARDIGAN', price: '$1,200' },
  { id: 7, brand: 'LOEWE', name: 'PUZZLE BAG', price: '$3,100' },
  { id: 8, brand: 'PRADA', name: 'CHUNKY LOAFER', price: '$1,150' },
  { id: 9, brand: 'BALENCIAGA', name: 'TRACK SNEAKER', price: '$1,050' },
  { id: 10, brand: 'GIVENCHY', name: 'ANTIGONA BAG', price: '$2,450' },
  { id: 11, brand: 'CELINE', name: 'TRIOMPHE BELT', price: '$690' },
  { id: 12, brand: 'RICK OWENS', name: 'DROPPED CROTCH PANT', price: '$890' }
];

const Shop = () => {
  return (
    <div className="home-container">
      <div className="section-title">DESIGNER APPAREL</div>
      
      <div className="product-grid">
        {DEMO_PRODUCTS.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image"></div>
            <div className="product-brand">{product.brand}</div>
            <div className="product-name">{product.name}</div>
            <div className="product-price">{product.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;

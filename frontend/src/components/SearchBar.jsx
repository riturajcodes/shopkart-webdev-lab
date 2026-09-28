import React from 'react';

const CATEGORIES = ['All Categories', 'Electronics', 'Fashion', 'Books', 'Home'];

const SearchBar = ({ search, onSearchChange, category, onCategoryChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="category-select"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat === 'All Categories' ? '' : cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchBar;

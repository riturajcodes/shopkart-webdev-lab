import React from 'react';
import { CATEGORIES, SORT_OPTIONS } from '../constants';
import { SearchIcon } from './Icons';

const SearchBar = ({ search, onSearchChange, category, onCategoryChange, sort, onSortChange }) => {
  return (
    <div className="filter-bar">
      <div className="category-pills" role="group" aria-label="Filter by category">
        {['', ...CATEGORIES].map((cat) => (
          <button
            key={cat || 'all'}
            type="button"
            className={`pill${category === cat ? ' active' : ''}`}
            aria-pressed={category === cat}
            onClick={() => onCategoryChange(cat)}
          >
            {cat || 'All'}
          </button>
        ))}
      </div>

      <div className="filter-controls">
        <label className="search-field">
          <SearchIcon width={18} height={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
            aria-label="Search products"
          />
        </label>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="category-select"
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;

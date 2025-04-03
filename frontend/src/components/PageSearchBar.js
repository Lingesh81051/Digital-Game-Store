// frontend/src/components/PageSearchBar.js
import React, { useState } from 'react';
import './PageSearchBar.css';

function PageSearchBar({ placeholder, onSearch, formStyle }) {
  const [keyword, setKeyword] = useState('');

  // Call onSearch on every change
  const handleChange = (e) => {
    const newKeyword = e.target.value;
    setKeyword(newKeyword);
    if (onSearch) {
      onSearch(newKeyword);
    }
  };

  // Keep the form submission handler if needed
  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(keyword);
  };

  return (
    <div className="page-search-bar">
      <form onSubmit={handleSearch} className="page-search-form" style={formStyle}>
        <input
          type="text"
          placeholder={placeholder || 'Search...'}
          value={keyword}
          onChange={handleChange}
        />
        <button type="submit" title="Search">
          <i className="bi bi-search"></i>
        </button>
      </form>
    </div>
  );
}

export default PageSearchBar;

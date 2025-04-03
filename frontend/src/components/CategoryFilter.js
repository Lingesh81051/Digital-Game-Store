// frontend/src/components/CategoryFilter.js
import React, { useState } from 'react';
import './CategoryFilter.css';

function CategoryFilter({ options, selected, onChange }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const handleCheckboxChange = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="category-filter">
      <button className="filter-icon" onClick={toggleDropdown} title="Filter categories">
        <i className="bi bi-funnel"></i>
      </button>
      {showDropdown && (
        <div className="filter-dropdown">
          {options.map(option => (
            <label key={option}>
              <input
                type="checkbox"
                value={option}
                checked={selected.includes(option)}
                onChange={() => handleCheckboxChange(option)}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryFilter;

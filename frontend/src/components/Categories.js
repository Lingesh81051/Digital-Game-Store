// frontend/src/components/Categories.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PageSearchBar from './PageSearchBar';
import './Categories.css';

function Categories() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // List of all category tags
  const allCategoryTags = [
    "Discover New", "Featured Discounts", "Free Games", "Trending Games", "New Releases",
    "Top Sellers", "Most Played", "Most popular", "Action", "Adventure", "Sports",
    "Simulation", "Platformer", "RPG", "First-person shooter", "Action-adventure",
    "Fighting", "Real-time strategy", "Racing", "Shooter", "Puzzle", "Casual",
    "Strategy game", "Massively multiplayer online role-playing", "Stealth", "Party",
    "Tactical role-playing", "Survival", "Battle Royale"
  ];

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    console.log("Categories search:", keyword);
  };

  const toggleFilterDropdown = () => {
    setShowFilterDropdown(prev => !prev);
  };

  const handleFilterChange = (tag) => {
    if (selectedFilters.includes(tag)) {
      setSelectedFilters(selectedFilters.filter(item => item !== tag));
    } else {
      setSelectedFilters([...selectedFilters, tag]);
    }
  };

  // Updated filtering: fallback to [] if product.categories is undefined.
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesFilter =
      selectedFilters.length === 0 ||
      selectedFilters.some(tag => (product.categories || []).includes(tag));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="categories-page">
      <div className="categories-header">
        <div className="search-filter-container">
          <PageSearchBar
            placeholder="Search in Categories..."
            onSearch={handleSearch}
            hideViewButtons={true}
            formStyle={{ maxWidth: '900px', width: '900px' }}
          />
          <button className="filter-icon" onClick={toggleFilterDropdown} title="Filter categories">
            <i className="bi bi-funnel"></i>
          </button>
        </div>
        {showFilterDropdown && (
          <div className="filter-dropdown">
            {allCategoryTags.map(tag => (
              <label key={tag} className="filter-label">
                <input
                  type="checkbox"
                  value={tag}
                  checked={selectedFilters.includes(tag)}
                  onChange={() => handleFilterChange(tag)}
                />
                {tag}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="categories-content">
        <h1>Categories</h1>
        <p>
          {selectedFilters.length > 0
            ? `Filtering by: ${selectedFilters.join(', ')}`
            : 'No filters applied.'}
        </p>
        <div className="products-grid">
          {loading ? (
            <p>Loading...</p>
          ) : filteredProducts.length === 0 ? (
            <p>No products found for the selected filters.</p>
          ) : (
            filteredProducts.map(product => {
              const imageUrl = product.image.startsWith('/')
                ? `http://localhost:5000${product.image}`
                : product.image;
              return (
                <div className="product-card" key={product._id}>
                  <img
                    src={imageUrl}
                    alt={product.name}
                    onError={(e) => {
                      if (e.target.src !== 'http://localhost:5000/images/placeholder.png') {
                        e.target.onerror = null;
                        e.target.src = 'http://localhost:5000/images/placeholder.png';
                      }
                    }}
                  />
                  <h3>{product.name}</h3>
                  <p className="price">${product.price}</p>
                  <div className="category-tags">
                    {(product.categories || []).map((cat, idx) => (
                      <span key={idx} className="tag">{cat}</span>
                    ))}
                  </div>
                  <Link to={`/product/${product._id}`} className="details-btn">
                    View Details
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Categories;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageSearchBar from './PageSearchBar';
import './Library.css';

function Library() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [libraryItems, setLibraryItems] = useState([]);
  const navigate = useNavigate();

  // Helper function to get auth config for API calls
  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Fetch library data from backend when component mounts
  useEffect(() => {
    async function fetchLibrary() {
      try {
        const response = await axios.get('/api/user/library', getAuthConfig());
        if (response.data && response.data.games) {
          setLibraryItems(response.data.games);
        }
      } catch (error) {
        console.error("Error fetching library:", error);
      }
    }
    fetchLibrary();
  }, []);

  const handleSearch = (keyword) => {
    console.log("Library search:", keyword);
    setSearchKeyword(keyword);
  };

  // Filter library items based on search keyword
  const filteredLibraryItems = libraryItems.filter(item =>
    item.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // Action handlers (replace alerts with your actual functionality)
  const handleInstall = (itemName) => {
    alert(`Installing ${itemName}...`);
  };

  const handleUpdates = (itemName) => {
    alert(`Checking for updates for ${itemName}...`);
  };

  const handleAchievements = (itemName) => {
    alert(`Viewing achievements for ${itemName}...`);
  };

  // Navigate to detailed view page for the game
  const handleStorePage = (itemId) => {
    navigate(`/product/${itemId}`);
  };

  return (
    <div className="library-page">
      <PageSearchBar
        placeholder="Search in Library..."
        onSearch={handleSearch}
      />
      <div className="library-container">
        <h1>Your Library</h1>
        {filteredLibraryItems.length === 0 ? (
          <p className="empty-msg">Your library is empty.</p>
        ) : (
          <div className="library-grid">
            {filteredLibraryItems.map(item => (
              <div key={item._id} className="library-card">
                <div className="tile-image">
                  <img
                    src={item.image.startsWith('/') ? `http://localhost:5000${item.image}` : item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'http://localhost:5000/images/placeholder.png';
                    }}
                  />
                </div>
                <div className="tile-details">
                  <h4>
                    <Link to={`/product/${item._id}`} className="game-link">
                      {item.name}
                    </Link>
                  </h4>
                  <div className="tile-actions">
                    <button className="action-btn install-btn" onClick={() => handleInstall(item.name)}>
                      <i className="fas fa-download"></i> Install
                    </button>
                    <button className="action-btn update-btn" onClick={() => handleUpdates(item.name)}>
                      <i className="fas fa-sync-alt"></i> Check for updates
                    </button>
                    <button className="action-btn achievements-btn" onClick={() => handleAchievements(item.name)}>
                      <i className="fas fa-trophy"></i> Achievements
                    </button>
                    <button className="action-btn store-btn" onClick={() => handleStorePage(item._id)}>
                      <i className="fas fa-store"></i> Go to store page
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Library;

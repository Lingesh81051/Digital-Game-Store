// frontend/src/components/Discover.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Discover.css';

function Discover() {
  const [discoverItems, setDiscoverItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDiscover() {
      try {
        // Uncomment and adjust the API call if you have a backend endpoint
        // const response = await axios.get('/api/discover');
        // setDiscoverItems(response.data);

        // For now, we use dummy data
        const dummyData = [
          { _id: 1, name: 'Epic Adventure', image: '/images/game1.jpg' },
          { _id: 2, name: 'Mystic Quest', image: '/images/game2.jpg' },
          { _id: 3, name: 'RPG Legends', image: '/images/game3.jpg' },
          { _id: 4, name: 'Strategy War', image: '/images/game4.jpg' },
        ];
        setDiscoverItems(dummyData);
      } catch (error) {
        console.error("Error fetching discover items:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDiscover();
  }, []);

  return (
    <div className="discover-container">
      <h1>Discover</h1>
      {loading ? (
        <p>Loading...</p>
      ) : discoverItems.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <div className="discover-grid">
          {discoverItems.map(item => {
            const imageUrl = item.image.startsWith('/')
              ? `http://localhost:5000${item.image}`
              : item.image;
            return (
              <div className="discover-card" key={item._id}>
                <img
                  src={imageUrl}
                  alt={item.name}
                  onError={(e) => {
                    if (e.target.src !== 'http://localhost:5000/images/placeholder.png') {
                      e.target.onerror = null;
                      e.target.src = 'http://localhost:5000/images/placeholder.png';
                    }
                  }}
                />
                <h3>{item.name}</h3>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Discover;

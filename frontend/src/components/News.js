// frontend/src/components/News.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './News.css';

function News() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await axios.get('/api/news');
        setNewsItems(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <div className="news-container">
      <h1>Game News</h1>
      {loading ? (
        <p>Loading news...</p>
      ) : newsItems.length === 0 ? (
        <p>No news found.</p>
      ) : (
        <div className="news-grid">
          {newsItems.map(item => {
            const imageUrl = item.image.startsWith('/')
              ? `http://localhost:5000${item.image}`
              : item.image;
            return (
              <div className="news-card" key={item._id}>
                <img
                  src={imageUrl}
                  alt={item.title}
                  onError={(e) => {
                    if (e.target.src !== 'http://localhost:5000/images/placeholder.png') {
                      e.target.onerror = null;
                      e.target.src = 'http://localhost:5000/images/placeholder.png';
                    }
                  }}
                />
                <h3>{item.title}</h3>
                <div className="news-meta">
                  <span className="news-date">{new Date(item.publishedDate).toLocaleDateString()}</span>
                  <span className="news-author">by {item.author}</span>
                </div>
                <p className="news-description">{item.description}</p>
                <Link to={`/news/${item._id}`} className="read-more-btn">
                  Read More
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default News;

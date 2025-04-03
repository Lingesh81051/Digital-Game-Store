// frontend/src/components/NewsDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './NewsDetail.css';

function NewsDetail() {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewsItem() {
      try {
        const response = await axios.get(`/api/news/${id}`);
        setNewsItem(response.data);
      } catch (error) {
        console.error("Error fetching news article:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNewsItem();
  }, [id]);

  if (loading) return <p>Loading news article...</p>;
  if (!newsItem) return <p>News article not found.</p>;

  const imageUrl = newsItem.image.startsWith('/')
    ? `http://localhost:5000${newsItem.image}`
    : newsItem.image;

  return (
    <div className="news-detail-container">
      <Link to="/news" className="back-btn">← Back to News</Link>
      <div className="news-detail">
        <img 
          src={imageUrl} 
          alt={newsItem.title} 
          onError={(e) => {
            if (e.target.src !== 'http://localhost:5000/images/placeholder.png') {
              e.target.onerror = null;
              e.target.src = 'http://localhost:5000/images/placeholder.png';
            }
          }}
        />
        <h1>{newsItem.title}</h1>
        <div className="news-meta">
          <span className="news-date">{new Date(newsItem.publishedDate).toLocaleDateString()}</span>
          <span className="news-author">by {newsItem.author}</span>
        </div>
        <div className="news-content">
          {newsItem.content.split('\n').map((para, index) => (
            <p key={index}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewsDetail;

// frontend/src/components/ProductDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import axios from 'axios';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams(); // Get product id from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarGames, setSimilarGames] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [notification, setNotification] = useState(""); // Popup message state

  // Comments state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [sortOrder, setSortOrder] = useState("mostRecent");
  const [likedComments, setLikedComments] = useState([]); // to track comment likes

  // Determine current user from localStorage (expects a "user" key as a JSON string with a "name" field)
  const currentUser = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;

  // Helper: check if user is logged in
  const isLoggedIn = () => Boolean(localStorage.getItem('token'));

  // Helper: get auth config for protected API calls
  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Fetch product details
  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
        if (isLoggedIn()) {
          const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
          setIsWishlisted(wishlist.includes(response.data._id));
        } else {
          setIsWishlisted(false);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  // Fetch similar games
  useEffect(() => {
    async function fetchSimilar() {
      if (!product) return;
      try {
        const res = await axios.get('/api/products');
        const similar = res.data.filter(p =>
          p._id !== product._id &&
          Array.isArray(p.categories) &&
          product.categories &&
          product.categories.some(cat => p.categories.includes(cat))
        );
        setSimilarGames(similar.slice(0, 4));
      } catch (error) {
        console.error("Error fetching similar games:", error);
      } finally {
        setSimilarLoading(false);
      }
    }
    fetchSimilar();
  }, [product]);

  // Fetch cart items to set the initial cart state.
  useEffect(() => {
    async function fetchCart() {
      if (isLoggedIn() && product) {
        try {
          const res = await axios.get('/api/user/cart', getAuthConfig());
          const inCart = res.data.some(item => item.product && item.product._id === product._id);
          setIsInCart(inCart);
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      } else {
        setIsInCart(false);
      }
    }
    fetchCart();
  }, [product]);

  // Fetch comments from backend
  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/products/${id}/comments`);
      setComments(res.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchComments();
    }
  }, [id]);

  // Listen for wishlist updates from other pages
  useEffect(() => {
    const handleWishlistUpdated = (event) => {
      if (event.detail && isLoggedIn()) {
        if (event.detail.removed && product && product._id === event.detail.removed) {
          setIsWishlisted(false);
        }
        if (event.detail.added && product && product._id === event.detail.added) {
          setIsWishlisted(true);
        }
      } else {
        setIsWishlisted(false);
      }
    };
    window.addEventListener('wishlistUpdated', handleWishlistUpdated);
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdated);
    };
  }, [product]);

  // Handler for toggling cart status
  const handleToggleCart = async () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    if (!isInCart) {
      try {
        await axios.post('/api/user/cart', { productId: product._id }, getAuthConfig());
        setIsInCart(true);
        setNotification("Game added to cart");
        setTimeout(() => setNotification(""), 2000);
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { added: product._id } }));
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    } else {
      try {
        await axios.delete(`/api/user/cart/${product._id}`, getAuthConfig());
        setIsInCart(false);
        setNotification("Game removed from cart");
        setTimeout(() => setNotification(""), 2000);
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { removed: product._id } }));
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  // Handler for adding to wishlist
  const handleAddToWishlist = async () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    try {
      await axios.post('/api/user/wishlist', { productId: product._id }, getAuthConfig());
      setIsWishlisted(true);
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      if (!wishlist.includes(product._id)) {
        wishlist.push(product._id);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
      }
      setNotification("Game added to wishlist");
      setTimeout(() => setNotification(""), 2000);
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { added: product._id } }));
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  // Handler for removing from wishlist
  const handleRemoveFromWishlist = async () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    try {
      await axios.delete(`/api/user/wishlist/${product._id}`, getAuthConfig());
      setIsWishlisted(false);
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const updated = wishlist.filter(id => id !== product._id);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      setNotification("Game removed from wishlist");
      setTimeout(() => setNotification(""), 2000);
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { removed: product._id } }));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  // --- Enhanced Comment Section ---

  // Redirect to login if not authenticated for any comment action
  const requireAuth = () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return false;
    }
    return true;
  };

  // Handler for posting a comment (persisted to backend)
  const handleAddComment = async () => {
    if (!requireAuth()) return;
    if (!newComment.trim()) return;
    const name = currentUser?.name || "Anonymous";
    const commentData = {
      user: name,
      text: newComment
    };
    try {
      await axios.post(`/api/products/${id}/comments`, commentData, getAuthConfig());
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // Handler for deleting a comment (only for comment author)
  const handleDeleteComment = async (commentId) => {
    if (!requireAuth()) return;
    try {
      await axios.delete(`/api/products/${id}/comments/${commentId}`, getAuthConfig());
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Handler for liking a comment (only one like per comment per user)
  const handleLikeComment = async (commentId) => {
    if (!requireAuth()) return;
    if (likedComments.includes(commentId)) {
      alert("You've already liked this comment");
      return;
    }
    try {
      await axios.post(`/api/products/${id}/comments/${commentId}/like`, {}, getAuthConfig());
      setLikedComments(prev => [...prev, commentId]);
      fetchComments();
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  // Handler for entering edit mode for a comment (only for comment author)
  const handleModifyComment = (commentId) => {
    if (!requireAuth()) return;
    setComments(prev =>
      prev.map(c =>
        c.id === commentId
          ? { ...c, isEditing: true, editText: c.text }  // initialize editText only once
          : c
      )
    );
  };

  // Handler for saving a modified comment – update only the specific comment in state
  const handleSaveModifiedComment = async (commentId) => {
    const commentToUpdate = comments.find(c => c.id === commentId);
    if (!commentToUpdate) return;
    try {
      await axios.put(
        `/api/products/${id}/comments/${commentId}`,
        { text: commentToUpdate.editText },
        getAuthConfig()
      );
      // Update just the modified comment locally
      setComments(prev =>
        prev.map(c =>
          c.id === commentId
            ? { ...c, text: commentToUpdate.editText, isEditing: false }
            : c
        )
      );
    } catch (error) {
      console.error("Error saving modified comment:", error);
    }
  };

  // Handler for updating edit text for a comment
  const handleEditChange = (commentId, value) => {
    setComments(prev =>
      prev.map(c => c.id === commentId ? { ...c, editText: value } : c)
    );
  };

  // Handler for toggling reply mode for a comment
  const toggleReplyMode = (commentId) => {
    setComments(prev =>
      prev.map(c =>
        c.id === commentId ? { ...c, isReplying: !c.isReplying, replyText: "" } : c
      )
    );
  };

  // Handler for updating reply text for a comment
  const handleReplyChange = (commentId, value) => {
    setComments(prev =>
      prev.map(c =>
        c.id === commentId ? { ...c, replyText: value } : c
      )
    );
  };

  // Handler for posting a reply
  const handlePostReply = async (commentId) => {
    const comment = comments.find(c => c.id === commentId);
    if (!comment || !comment.replyText.trim()) return;
    if (!requireAuth()) return;
    const name = currentUser?.name || "Anonymous";
    const replyData = { user: name, text: comment.replyText };
    try {
      await axios.post(`/api/products/${id}/comments/${commentId}/reply`, replyData, getAuthConfig());
      fetchComments();
    } catch (error) {
      console.error("Error replying to comment:", error);
    }
  };

  // --- Reply Actions for replies (only for reply author) ---

  // Handler for deleting a reply without confirmation
  const handleDeleteReply = async (commentId, replyId) => {
    if (!requireAuth()) return;
    try {
      await axios.delete(`/api/products/${id}/comments/${commentId}/reply/${replyId}`, getAuthConfig());
      fetchComments();
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  // Handler for toggling reply editing (inline modification)
  const toggleReplyEditing = (commentId, replyId) => {
    setComments(prev =>
      prev.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: c.replies.map(r =>
              r.id === replyId
                ? { ...r, isEditing: true, editText: r.text }  // initialize once
                : r
            )
          };
        }
        return c;
      })
    );
  };

  // Handler for saving the modified reply – update only the specific reply in state
  const handleSaveModifiedReply = async (commentId, replyId) => {
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;
    const replyToUpdate = comment.replies.find(r => r.id === replyId);
    if (!replyToUpdate) return;
    try {
      await axios.put(
        `/api/products/${id}/comments/${commentId}/reply/${replyId}`,
        { text: replyToUpdate.editText },
        getAuthConfig()
      );
      setComments(prev =>
        prev.map(c => {
          if (c.id === commentId) {
            return {
              ...c,
              replies: c.replies.map(r =>
                r.id === replyId ? { ...r, text: replyToUpdate.editText, isEditing: false } : r
              )
            };
          }
          return c;
        })
      );
    } catch (error) {
      console.error("Error saving modified reply:", error);
    }
  };

  const sortedComments = [...comments].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  const releaseDate = product.releaseDate
    ? new Date(product.releaseDate).toLocaleDateString()
    : "TBA";

  return (
    <div className="product-detail">
      <div className="back-button">
        <button onClick={() => navigate(-1)}>&larr; Back</button>
      </div>
      <div className="hero-section">
        <img
          src={product.image.startsWith('/') ? `http://localhost:5000${product.image}` : product.image}
          alt={product.name}
          className="hero-image"
          onError={(e) => {
            if (e.target.src !== 'http://localhost:5000/images/placeholder.png') {
              e.target.onerror = null;
              e.target.src = 'http://localhost:5000/images/placeholder.png';
            }
          }}
        />
      </div>
      <div className="info-section">
        <h1 className="product-title">{product.name}</h1>
        <p className="product-description">{product.description}</p>
        <div className="product-details">
          <div className="detail-item">
            <strong>Genre:</strong> {product.categories ? product.categories.join(', ') : "N/A"}
          </div>
          <div className="detail-item">
            <strong>Price:</strong> ${product.price}
          </div>
          <div className="detail-item">
            <strong>Developer:</strong> {product.developer || "Unknown"}
          </div>
          <div className="detail-item">
            <strong>Release Date:</strong> {releaseDate}
          </div>
          <div className="detail-item">
            <strong>Platform:</strong> {product.platform || "Multiple"}
          </div>
          <div className="detail-item">
            <strong>Ratings:</strong> {product.ratings ? `${product.ratings} / 5` : "No ratings yet"}
          </div>
        </div>
        {product.minRequirements && (
          <div className="min-requirements">
            <h2>Minimum System Requirements</h2>
            <p><strong>OS:</strong> {product.minRequirements.os}</p>
            <p><strong>Processor:</strong> {product.minRequirements.processor}</p>
            <p><strong>RAM:</strong> {product.minRequirements.ram}</p>
            <p><strong>Hard Drive:</strong> {product.minRequirements.hardDrive}</p>
            <p><strong>Video Card:</strong> {product.minRequirements.videoCard}</p>
            <p><strong>Sound Card:</strong> {product.minRequirements.soundCard}</p>
            <p><strong>DirectX:</strong> {product.minRequirements.directX}</p>
            <p><strong>Keyboard and Mouse:</strong> {product.minRequirements.peripherals}</p>
          </div>
        )}
        <div className="cta-buttons">
          {isWishlisted ? (
            <button className="remove-from-wishlist-btn" onClick={handleRemoveFromWishlist}>
              Remove from Wishlist
            </button>
          ) : (
            <button className="add-to-wishlist-btn" onClick={handleAddToWishlist}>
              Add to Wishlist
            </button>
          )}
          <button className="add-to-cart-btn" onClick={handleToggleCart}>
            {isInCart ? "Remove from Cart" : "Add to Cart"}
          </button>
        </div>
        {notification && (
          <div className="notification-popup">
            {notification}
          </div>
        )}
      </div>
      <div className="trailer-section">
        <h2 className="section-title left-align">Game Trailer</h2>
        {product.trailer ? (
          <div className="trailer-container">
            <iframe
              src={product.trailer}
              title="Game Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <p>No trailer available.</p>
        )}
      </div>
      <div className="recommendations-section">
        <h2 className="section-title left-align">Similar Games</h2>
        {similarLoading ? (
          <p>Loading similar games...</p>
        ) : similarGames.length === 0 ? (
          <p>No similar games found.</p>
        ) : (
          <div className="recommendations-container">
            {similarGames.map(similar => {
              const simImage = similar.image.startsWith('/')
                ? `http://localhost:5000${similar.image}`
                : similar.image;
              return (
                <div className="recommendation-card" key={similar._id}>
                  <img
                    src={simImage}
                    alt={similar.name}
                    onError={(e) => {
                      if (e.target.src !== 'http://localhost:5000/images/placeholder.png') {
                        e.target.onerror = null;
                        e.target.src = 'http://localhost:5000/images/placeholder.png';
                      }
                    }}
                  />
                  <h3>{similar.name}</h3>
                  <p className="price">${similar.price}</p>
                  <Link to={`/product/${similar._id}`} className="details-btn">
                    View Details
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="comments-section">
        <div className="comments-header">
          <h2>Comments</h2>
          <div className="sort-options">
            <label htmlFor="sort">Sort by:</label>
            <select
              id="sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="mostRecent">Most Recent</option>
            </select>
          </div>
        </div>
        {isLoggedIn() && (
          <div className="new-comment">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your comment..."
            ></textarea>
            <button onClick={handleAddComment}>Post Comment</button>
          </div>
        )}
        <div className="comments-list">
          {sortedComments.map(comment => (
            <div className="comment-card" key={comment.id}>
              <div className="comment-header">
                <span className="comment-user">{comment.user}</span>
                <span className="comment-timestamp">{new Date(comment.timestamp).toLocaleString()}</span>
              </div>
              {comment.isEditing ? (
                <textarea
                  value={comment.editText}
                  onChange={(e) => handleEditChange(comment.id, e.target.value)}
                ></textarea>
              ) : (
                <p className="comment-text">{comment.text}</p>
              )}
              {isLoggedIn() && (
                <div className="comment-actions">
                  <button className="like-btn" onClick={() => handleLikeComment(comment.id)}>
                    Like ({comment.likes})
                  </button>
                  {currentUser && currentUser.name === comment.user && (
                    <>
                      <button className="delete-btn" onClick={() => handleDeleteComment(comment.id)}>
                        Delete
                      </button>
                      {comment.isEditing ? (
                        <button className="modify-btn" onClick={() => handleSaveModifiedComment(comment.id)}>
                          Save
                        </button>
                      ) : (
                        <button className="modify-btn" onClick={() => handleModifyComment(comment.id)}>
                          Modify
                        </button>
                      )}
                    </>
                  )}
                  <button className="reply-btn" onClick={() => toggleReplyMode(comment.id)}>
                    {comment.isReplying ? "Cancel Reply" : "Reply"}
                  </button>
                </div>
              )}
              {comment.isReplying && (
                <div className="reply-section" style={{ marginTop: '10px' }}>
                  <textarea
                    value={comment.replyText || ""}
                    onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                    placeholder="Type your reply here..."
                  ></textarea>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="reply-btn" onClick={() => handlePostReply(comment.id)}>
                      Post Reply
                    </button>
                    <button className="reply-cancel-btn" onClick={() => toggleReplyMode(comment.id)}>
                      Cancel Reply
                    </button>
                  </div>
                </div>
              )}
              {comment.replies && comment.replies.length > 0 && (
                <div className="replies">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="reply">
                      <div className="reply-header">
                        <span className="reply-user">{reply.user}</span>
                        <span className="reply-timestamp">{new Date(reply.timestamp).toLocaleString()}</span>
                      </div>
                      {reply.isEditing ? (
                        <textarea
                          value={reply.editText}
                          onChange={(e) => {
                            setComments(prev => 
                              prev.map(c => {
                                if(c.id === comment.id) {
                                  return {
                                    ...c,
                                    replies: c.replies.map(r => 
                                      r.id === reply.id ? { ...r, editText: e.target.value } : r
                                    )
                                  };
                                }
                                return c;
                              })
                            );
                          }}
                        ></textarea>
                      ) : (
                        <p className="reply-text">{reply.text}</p>
                      )}
                      {isLoggedIn() && currentUser && currentUser.name === reply.user && (
                        <div className="reply-actions">
                          <button className="reply-action-delete-btn" onClick={() => handleDeleteReply(comment.id, reply.id)}>
                            Delete
                          </button>
                          {reply.isEditing ? (
                            <button className="reply-action-save-btn" onClick={() => handleSaveModifiedReply(comment.id, reply.id)}>
                              Save
                            </button>
                          ) : (
                            <button className="reply-action-modify-btn" onClick={() => toggleReplyEditing(comment.id, reply.id)}>
                              Modify
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

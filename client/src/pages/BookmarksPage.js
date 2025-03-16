import React, { useState, useEffect } from 'react';
import ContestCard from '../components/ContestCard';
import api from '../utils/api';
import './BookmarksPage.css';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // User ID would typically come from authentication
  const userId = '123';  // Mock user ID
  
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/bookmarks/${userId}`);
        setBookmarks(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        setLoading(false);
      }
    };
    
    fetchBookmarks();
  }, [userId]);
  
  const handleBookmark = async (contestId, isBookmarked) => {
    try {
      if (isBookmarked) {
        // Remove bookmark
        await api.delete(`/bookmarks/${userId}/${contestId}`);
        setBookmarks(bookmarks.filter(bookmark => bookmark.contestId._id !== contestId));
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };
  
  if (loading) {
    return <div className="loading">Loading bookmarks...</div>;
  }
  
  return (
    <div className="bookmarks-page">
      <h1>Your Bookmarked Contests</h1>
      
      {bookmarks.length > 0 ? (
        <div className="bookmarked-contests">
          {bookmarks.map(bookmark => (
            <ContestCard 
              key={bookmark.contestId._id} 
              contest={bookmark.contestId} 
              isBookmarked={true}
              onBookmark={handleBookmark}
            />
          ))}
        </div>
      ) : (
        <div className="no-bookmarks">
          <p>You haven't bookmarked any contests yet.</p>
          <p>Go to the home page and look for the star icon to bookmark contests.</p>
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;
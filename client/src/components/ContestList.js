import React, { useState, useEffect, useCallback } from 'react';
import ContestCard from './ContestCard';
import FilterComponent from './FilterComponent';
import api from '../utils/api';
import './ContestList.css';

const ContestList = () => {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    platform: ['Codeforces', 'CodeChef', 'LeetCode'],
    status: 'upcoming'
  });
  const [bookmarks, setBookmarks] = useState([]);
  
  // User ID would typically come from authentication
  const userId = '123';  // Mock user ID

  const fetchContests = useCallback(async () => {
    try {
      setLoading(true);
      
      // Create query params for platform filter
      const platformQuery = filters.platform.join(',');
      
      const response = await api.get(`/contests?platform=${platformQuery}&status=${filters.status}`);
      setContests(response.data.data);
      setFilteredContests(response.data.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contests:', error);
      setLoading(false);
    }
  }, [filters]);

  const fetchBookmarks = useCallback(async () => {
    try {
      const response = await api.get(`/bookmarks/${userId}`);
      // Extract contest IDs from bookmarks
      const bookmarkedIds = response.data.data.map(bookmark => bookmark.contestId._id);
      setBookmarks(bookmarkedIds);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchContests();
    fetchBookmarks();
  }, [fetchContests, fetchBookmarks]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleBookmark = async (contestId, isBookmarked) => {
    try {
      if (isBookmarked) {
        // Remove bookmark
        await api.delete(`/bookmarks/${userId}/${contestId}`);
        setBookmarks(bookmarks.filter(id => id !== contestId));
      } else {
        // Add bookmark
        await api.post('/bookmarks', { userId, contestId });
        setBookmarks([...bookmarks, contestId]);
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading contests...</div>;
  }

  return (
    <div className="contest-list-container">
      <FilterComponent 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />
      
      <div className="contest-count">
        {filteredContests.length} contests found
      </div>
      
      <div className="contest-list">
        {filteredContests.length > 0 ? (
          filteredContests.map(contest => (
            <ContestCard 
              key={contest._id} 
              contest={contest} 
              isBookmarked={bookmarks.includes(contest._id)}
              onBookmark={handleBookmark}
            />
          ))
        ) : (
          <div className="no-contests">No contests found with the selected filters.</div>
        )}
      </div>
    </div>
  );
};

export default ContestList;
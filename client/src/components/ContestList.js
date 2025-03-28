import React, { useState, useEffect, useCallback } from 'react';
import ContestCard from './ContestCard';
import FilterComponent from './FilterComponent';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ContestList = () => {
  const { user } = useAuth();
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    platform: ['Codeforces', 'CodeChef', 'LeetCode'],
    status: 'upcoming'
  });
  const [bookmarks, setBookmarks] = useState([]);

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
    if (!user) return;
    
    try {
      const response = await api.get('/bookmarks');
      if (response.data.success) {
        // Extract contest IDs from bookmarks
        const bookmarkedIds = response.data.data.map(contest => contest._id);
        setBookmarks(bookmarkedIds);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchContests();
    fetchBookmarks();
  }, [fetchContests, fetchBookmarks]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleBookmark = async (contestId, isBookmarked) => {
    if (!user) {
      // Show login modal or redirect to login
      return;
    }

    try {
      if (isBookmarked) {
        // Remove bookmark
        await api.delete(`/bookmarks/${contestId}`);
        setBookmarks(bookmarks.filter(id => id !== contestId));
      } else {
        // Add bookmark
        const response = await api.post('/bookmarks', { contestId });
        if (response.data.success) {
          setBookmarks([...bookmarks, contestId]);
        }
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FilterComponent 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />
      
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {filteredContests.length} contests found
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="col-span-full text-center text-gray-600 dark:text-gray-400 py-8">
            No contests found with the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestList;
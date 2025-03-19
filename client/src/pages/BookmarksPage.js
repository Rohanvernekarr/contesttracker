import React, { useState, useEffect } from 'react';
import ContestCard from '../components/ContestCard';
import api from '../utils/api';

const BookmarksPage = () => {
  const [bookmarkedContests, setBookmarkedContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookmarkedContests();
  }, []);

  const fetchBookmarkedContests = async () => {
    try {
      const response = await api.get('/bookmarks');
      if (response.data.success) {
        setBookmarkedContests(response.data.data);
      }
    } catch (error) {
      setError('Failed to fetch bookmarked contests');
      console.error('Error fetching bookmarked contests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (contestId, isBookmarked) => {
    try {
      if (isBookmarked) {
        await api.delete(`/bookmarks/${contestId}`);
        setBookmarkedContests(bookmarkedContests.filter(contest => contest._id !== contestId));
      } else {
        const response = await api.post('/bookmarks', { contestId });
        if (response.data.success) {
          setBookmarkedContests([...bookmarkedContests, response.data.data]);
        }
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        Bookmarked Contests
      </h1>
      
      {bookmarkedContests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            You haven't bookmarked any contests yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedContests.map(contest => (
            <ContestCard
              key={contest._id}
              contest={contest}
              isBookmarked={true}
              onBookmark={handleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;
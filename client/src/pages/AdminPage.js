import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminPage = () => {
  const [contests, setContests] = useState([]);
  const [selectedContest, setSelectedContest] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const response = await api.get('/contests');
      if (response.data.success) {
        setContests(response.data.data);
      }
    } catch (error) {
      setError('Failed to fetch contests');
      console.error('Error fetching contests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/solutions', {
        contestId: selectedContest._id,
        youtubeUrl,
      });
      if (response.data.success) {
        setYoutubeUrl('');
        fetchContests();
      }
    } catch (error) {
      setError('Failed to add solution');
      console.error('Error adding solution:', error);
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
        Admin Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Past Contests
          </h2>
          <div className="space-y-4">
            {contests
              .filter(contest => contest.status === 'past')
              .map(contest => (
                <div
                  key={contest._id}
                  className={`card cursor-pointer ${
                    selectedContest?._id === contest._id
                      ? 'ring-2 ring-primary'
                      : ''
                  }`}
                  onClick={() => setSelectedContest(contest)}
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {contest.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(contest.startTime).toLocaleDateString()}
                  </p>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Add Solution
          </h2>
          {selectedContest ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="input"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Add Solution
              </button>
            </form>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              Select a contest to add a solution
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
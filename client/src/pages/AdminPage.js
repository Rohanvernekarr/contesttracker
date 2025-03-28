import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const AdminPage = () => {
  const { user, login } = useAuth();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContest, setSelectedContest] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user?.isAdmin) {
      fetchContests();
    }
  }, [user]);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contests');
      if (response.data.success) {
        // Sort contests by start time in descending order
        const sortedContests = response.data.data.sort((a, b) => 
          new Date(b.startTime) - new Date(a.startTime)
        );
        setContests(sortedContests);
      }
    } catch (error) {
      console.error('Error fetching contests:', error);
      setError('Failed to fetch contests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(email, password);
      if (result.success) {
        setIsLoginForm(false);
        fetchContests();
      } else {
        setLoginError(result.error || 'Login failed');
      }
    } catch (error) {
      setLoginError('An error occurred during login');
    }
  };

  const handleAddSolution = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/solutions', {
        contestId: selectedContest._id,
        youtubeUrl
      });
      
      if (response.data.success) {
        setYoutubeUrl('');
        // Refresh contests to show updated solution
        fetchContests();
      }
    } catch (error) {
      console.error('Error adding solution:', error);
      setError('Failed to add solution');
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Login</h2>
          
          {loginError && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Past Contests List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Past Contests</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {contests.filter(contest => new Date(contest.endTime) < new Date()).map(contest => (
                <div
                  key={contest._id}
                  className={`p-4 rounded-lg border ${
                    selectedContest?._id === contest._id
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-gray-200 dark:border-gray-700'
                  } cursor-pointer hover:border-primary transition-colors duration-200`}
                  onClick={() => setSelectedContest(contest)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{contest.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(contest.startTime).toLocaleString()}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      {contest.platform}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Solution Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add Solution</h2>
            
            {selectedContest ? (
              <>
                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">{selectedContest.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(selectedContest.startTime).toLocaleString()}
                  </p>
                </div>

                <form onSubmit={handleAddSolution} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="https://youtube.com/watch?v=..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Add Solution
                  </button>
                </form>
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Select a contest to add a solution
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
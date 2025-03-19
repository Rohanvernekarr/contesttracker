import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import api from '../utils/api';

const ContestCard = ({ contest, isBookmarked, onBookmark }) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [solutionLink, setSolutionLink] = useState(null);
  
  // Format date and time
  const startTime = new Date(contest.startTime);
  const formattedDate = startTime.toLocaleDateString();
  const formattedTime = startTime.toLocaleTimeString();
  
  useEffect(() => {
    // Update time remaining every minute
    const calculateTimeRemaining = () => {
      const now = new Date();
      const start = new Date(contest.startTime);
      
      if (now < start) {
        setTimeRemaining(formatDistanceToNow(start, { addSuffix: true }));
      } else {
        setTimeRemaining('Started');
      }
    };
    
    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000);
    
    return () => clearInterval(interval);
  }, [contest.startTime]);
  
  useEffect(() => {
    // Fetch solution link for past contests
    const fetchSolution = async () => {
      if (contest.status === 'past') {
        try {
          const response = await api.get(`/solutions/${contest._id}`);
          if (response.data.success) {
            setSolutionLink(response.data.data.youtubeUrl);
          }
        } catch (error) {
          // Solution not found, which is fine
          console.log('No solution found for this contest');
        }
      }
    };
    
    fetchSolution();
  }, [contest._id, contest.status]);
  
  // Get platform icon
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'Codeforces':
        return '🔴';
      case 'CodeChef':
        return '👨‍🍳';
      case 'LeetCode':
        return '🟨';
      default:
        return '🏆';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'past':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'Codeforces':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'CodeChef':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'LeetCode':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {contest.name}
          </h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${getPlatformColor(contest.platform)}`}>
              {contest.platform}
            </span>
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(contest.status)}`}>
              {contest.status}
            </span>
          </div>
          <div className="text-gray-600 dark:text-gray-400 mb-2">
            <p>Starts: {new Date(contest.startTime).toLocaleString()}</p>
            <p>Ends: {new Date(contest.endTime).toLocaleString()}</p>
            <p>Time until start: {timeRemaining}</p>
          </div>
          <div className="space-x-4">
            <a
              href={contest.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80"
            >
              View Contest →
            </a>
            {solutionLink && (
              <a
                href={solutionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-secondary/80 dark:text-secondary dark:hover:text-secondary/80"
              >
                Watch Solution →
              </a>
            )}
          </div>
        </div>
        <button
          onClick={() => onBookmark(contest._id, isBookmarked)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <svg
            className={`w-6 h-6 ${isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ContestCard;
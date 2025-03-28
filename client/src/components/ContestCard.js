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

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'Codeforces':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.5 7.5A1.5 1.5 0 0 1 6 6h13a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 14v-7zM6 7a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5H6z"/>
          </svg>
        );
      case 'CodeChef':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
        );
      case 'LeetCode':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.27 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193a3.458 3.458 0 0 1-.739-1.06 3.53 3.53 0 0 1-.22-.758 3.533 3.533 0 0 1 .024-1.311 3.611 3.611 0 0 1 .219-.717 3.47 3.47 0 0 1 .739-1.06l4.276-4.193c.26-.26.599-.407.958-.407.36 0 .698.147.958.407l4.277 4.193c.26.26.407.598.407.958a1.386 1.386 0 0 1-1.407 1.407 1.386 1.386 0 0 1-.958-.407L13.483 0z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-800 group h-full flex flex-col">
      {/* Platform and Status */}
      <div className="flex justify-between items-center mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPlatformColor(contest.platform)}`}>
          {getPlatformIcon(contest.platform)}
          <span className="ml-2">{contest.platform}</span>
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contest.status)}`}>
          {contest.status}
        </span>
      </div>

      {/* Contest Name */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4  transition-colors duration-200">
        {contest.name}
      </h3>

      {/* Time Information */}
      <div className="space-y-2 mb-6 flex-grow">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium mr-2">Starts:</span>
          <span>{new Date(contest.startTime).toLocaleString()}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium mr-2">Ends:</span>
          <span>{new Date(contest.endTime).toLocaleString()}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium mr-2">Time until start:</span>
          <span className="text-gray-400">{timeRemaining}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="flex space-x-3">
          <a
            href={contest.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transform hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Contest
          </a>
          {solutionLink && (
            <a
              href={solutionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transform hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Solution
            </a>
          )}
        </div>
        <button
          onClick={() => onBookmark(contest._id, isBookmarked)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transform hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <svg
            className={`w-6 h-6 ${isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-400 hover:text-yellow-500'}`}
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
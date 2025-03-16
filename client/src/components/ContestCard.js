import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import api from '../utils/api';
import './ContestCard.css';

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

const handleBookmarkClick = () => {
  onBookmark(contest._id, isBookmarked);
};

return (
  <div className={`contest-card ${contest.status}`}>
    <div className="contest-header">
      <span className="platform-icon">{getPlatformIcon(contest.platform)}</span>
      <span className="platform-name">{contest.platform}</span>
      <button 
        className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
        onClick={handleBookmarkClick}
      >
        {isBookmarked ? '★' : '☆'}
      </button>
    </div>
    
    <h3 className="contest-name">{contest.name}</h3>
    
    <div className="contest-time">
      <div><strong>Date:</strong> {formattedDate}</div>
      <div><strong>Time:</strong> {formattedTime}</div>
      <div><strong>Status:</strong> {contest.status === 'upcoming' ? timeRemaining : contest.status}</div>
    </div>
    
    <div className="contest-links">
      <a href={contest.url} target="_blank" rel="noopener noreferrer" className="contest-link">
        Visit Contest
      </a>
      
      {solutionLink && (
        <a href={solutionLink} target="_blank" rel="noopener noreferrer" className="solution-link">
          Watch Solution
        </a>
      )}
    </div>
  </div>
);
};

export default ContestCard;
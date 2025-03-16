import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './AdminPage.css';

const AdminPage = () => {
  const [contests, setContests] = useState([]);
  const [selectedContest, setSelectedContest] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        // Fetch past contests
        const response = await api.get('/contests?status=past');
        setContests(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contests:', error);
        setLoading(false);
      }
    };
    
    fetchContests();
  }, []);
  
  const handleContestChange = (e) => {
    setSelectedContest(e.target.value);
  };
  
  const handleUrlChange = (e) => {
    setYoutubeUrl(e.target.value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedContest || !youtubeUrl) {
      setMessage('Please select a contest and provide a YouTube URL');
      return;
    }
    
    try {
      await api.post('/solutions', {
        contestId: selectedContest,
        youtubeUrl
      });
      
      setMessage('Solution added successfully!');
      setSelectedContest('');
      setYoutubeUrl('');
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error adding solution:', error);
      setMessage('Error adding solution. Please try again.');
    }
  };
  
  if (loading) {
    return <div className="loading">Loading contests...</div>;
  }
  
  return (
    <div className="admin-page">
      <h1>Admin Panel</h1>
      <p>Add YouTube solution links to past contests</p>
      
      {message && <div className="message">{message}</div>}
      
      <form className="solution-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="contest">Select Contest:</label>
          <select 
            id="contest" 
            value={selectedContest} 
            onChange={handleContestChange}
            required
          >
            <option value="">-- Select a contest --</option>
            {contests.map(contest => (
              <option key={contest._id} value={contest._id}>
                {contest.platform} - {contest.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="youtubeUrl">YouTube Solution URL:</label>
          <input 
            type="url" 
            id="youtubeUrl" 
            value={youtubeUrl} 
            onChange={handleUrlChange}
            placeholder="https://www.youtube.com/watch?v=..."
            required
          />
        </div>
        
        <button type="submit" className="submit-btn">Add Solution</button>
      </form>
      
      <div className="playlists-info">
        <h2>YouTube Playlists</h2>
        <ul>
          <li><a href="https://youtube.com/playlist?list=your-leetcode-playlist" target="_blank" rel="noopener noreferrer">Leetcode PCDs</a></li>
          <li><a href="https://youtube.com/playlist?list=your-codeforces-playlist" target="_blank" rel="noopener noreferrer">Codeforces PCDs</a></li>
          <li><a href="https://youtube.com/playlist?list=your-codechef-playlist" target="_blank" rel="noopener noreferrer">Codechef PCDs</a></li>
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
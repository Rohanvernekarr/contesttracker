const axios = require('axios');
const Contest = require('../models/Contest');
const Solution = require('../models/Solution');

/**
 * Extracts contest ID from video title
 * @param {string} title - YouTube video title
 * @param {string} platform - Platform name (Codeforces, CodeChef, LeetCode)
 * @returns {string|null} Contest ID or null if not found
 */
const extractContestId = (title, platform) => {
  if (platform === 'Codeforces') {
    const match = title.match(/Codeforces Round #(\d+)/i);
    return match ? match[1] : null;
  } else if (platform === 'CodeChef') {
    const match = title.match(/CodeChef (\w+) Contest/i);
    return match ? match[1] : null;
  } else if (platform === 'LeetCode') {
    const match = title.match(/LeetCode (Weekly|Biweekly) Contest (\d+)/i);
    return match ? `${match[1].toLowerCase()}-contest-${match[2]}` : null;
  }
  return null;
};

/**
 * Fetches YouTube videos from the channel and adds them as solutions
 */
const fetchYoutubeVideos = async () => {
  try {
    // Replace with your YouTube API key and channel ID
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
    
    if (!API_KEY || !CHANNEL_ID) {
      console.error('YouTube API key or Channel ID not provided');
      return;
    }
    
    // Fetch playlists
    const playlistsResponse = await axios.get(`https://www.googleapis.com/youtube/v3/playlists`, {
      params: {
        part: 'snippet',
        channelId: CHANNEL_ID,
        maxResults: 50,
        key: API_KEY
      }
    });
    
    // Filter playlists that match our criteria
    const contestPlaylists = playlistsResponse.data.items.filter(playlist => {
      const title = playlist.snippet.title;
      return title.includes('PCD') || title.includes('Problem Solving');
    });
    
    for (const playlist of contestPlaylists) {
      const playlistId = playlist.id;
      const playlistTitle = playlist.snippet.title;
      
      let platform;
      if (playlistTitle.includes('Leetcode')) platform = 'LeetCode';
      else if (playlistTitle.includes('Codeforces')) platform = 'Codeforces';
      else if (playlistTitle.includes('Codechef')) platform = 'CodeChef';
      else continue;
      
      // Fetch videos in the playlist
      const videosResponse = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
        params: {
          part: 'snippet',
          playlistId: playlistId,
          maxResults: 50,
          key: API_KEY
        }
      });
      
      for (const video of videosResponse.data.items) {
        const videoTitle = video.snippet.title;
        const videoUrl = `https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`;
        
        // Extract contest identifier from the video title
        const contestId = extractContestId(videoTitle, platform);
        
        if (contestId) {
          // Find the contest in our database
          const contest = await Contest.findOne({
            platform,
            name: { $regex: contestId, $options: 'i' }
          });
          
          if (contest) {
            // Check if solution already exists
            const existingSolution = await Solution.findOne({ contestId: contest._id });
            
            if (!existingSolution) {
              // Create new solution
              await Solution.create({
                contestId: contest._id,
                youtubeUrl: videoUrl,
                addedManually: false
              });
              
              console.log(`Added solution for ${contest.name}: ${videoUrl}`);
            }
          }
        }
      }
    }
    
    console.log('YouTube video fetching completed');
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
  }
};

module.exports = {
  fetchYoutubeVideos
};
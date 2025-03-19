const axios = require('axios');
const Contest = require('../models/Contest');

/**
 * Fetches all contests from Codeforces
 * @returns {Promise<Array>} Array of Codeforces contests
 */
const fetchCodeforcesContests = async () => {
  try {
    const response = await axios.get('https://codeforces.com/api/contest.list');
    
    if (response.data.status === 'OK') {
      const contests = response.data.result.map(contest => ({
        name: contest.name,
        platform: 'Codeforces',
        startTime: new Date(contest.startTimeSeconds * 1000),
        endTime: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000),
        url: `https://codeforces.com/contest/${contest.id}`,
        status: contest.phase === 'BEFORE' ? 'upcoming' : 
                contest.phase === 'CODING' ? 'ongoing' : 'past'
      }));
      
      return contests;
    }
    return [];
  } catch (error) {
    console.error('Error fetching Codeforces contests:', error);
    return [];
  }
};

/**
 * Fetches all contests from CodeChef
 * @returns {Promise<Array>} Array of CodeChef contests
 */
const fetchCodechefContests = async () => {
  try {
    // Using the new CodeChef API endpoint
    const response = await axios.get('https://www.codechef.com/api/list/contests/all');
    
    if (response.data && response.data.future_contests) {
      const contests = response.data.future_contests.map(contest => ({
        name: contest.contest_name,
        platform: 'CodeChef',
        startTime: new Date(contest.contest_start_date),
        endTime: new Date(contest.contest_end_date),
        url: `https://www.codechef.com/${contest.contest_code}`,
        status: 'upcoming'
      }));
      
      return contests;
    }
    return [];
  } catch (error) {
    console.error('Error fetching CodeChef contests:', error);
    return [];
  }
};

/**
 * Fetches all contests from LeetCode
 * @returns {Promise<Array>} Array of LeetCode contests
 */
const fetchLeetcodeContests = async () => {
  try {
    // LeetCode doesn't have an official API, so we'll use their GraphQL API
    const response = await axios.post('https://leetcode.com/graphql', {
      query: `
        query {
          allContests {
            title
            startTime
            duration
            titleSlug
          }
        }
      `
    });
    
    if (response.data.data.allContests) {
      const now = Date.now();
      
      const contests = response.data.data.allContests.map(contest => {
        const startTime = new Date(contest.startTime * 1000);
        const endTime = new Date((contest.startTime + contest.duration) * 1000);
        
        let status;
        if (startTime > now) {
          status = 'upcoming';
        } else if (endTime < now) {
          status = 'past';
        } else {
          status = 'ongoing';
        }
        
        return {
          name: contest.title,
          platform: 'LeetCode',
          startTime,
          endTime,
          url: `https://leetcode.com/contest/${contest.titleSlug}`,
          status
        };
      });
      
      return contests;
    }
    return [];
  } catch (error) {
    console.error('Error fetching LeetCode contests:', error);
    return [];
  }
};

/**
 * Fetches all contests from all platforms and updates the database
 */
const fetchAllContests = async () => {
  try {
    console.log('Fetching contests from Codeforces...');
    const codeforces = await fetchCodeforcesContests();
    console.log(`Found ${codeforces.length} Codeforces contests`);

    console.log('Fetching contests from CodeChef...');
    const codechef = await fetchCodechefContests();
    console.log(`Found ${codechef.length} CodeChef contests`);

    console.log('Fetching contests from LeetCode...');
    const leetcode = await fetchLeetcodeContests();
    console.log(`Found ${leetcode.length} LeetCode contests`);
    
    const allContests = [...codeforces, ...codechef, ...leetcode];
    
    // Update contest status
    const now = new Date();
    allContests.forEach(contest => {
      if (contest.startTime > now) {
        contest.status = 'upcoming';
      } else if (contest.endTime < now) {
        contest.status = 'past';
      } else {
        contest.status = 'ongoing';
      }
    });
    
    // Bulk upsert contests
    for (const contest of allContests) {
      try {
        await Contest.findOneAndUpdate(
          { name: contest.name, platform: contest.platform },
          contest,
          { upsert: true, new: true }
        );
      } catch (error) {
        console.error(`Error updating contest ${contest.name}:`, error);
      }
    }
    
    console.log(`Successfully updated ${allContests.length} contests`);
  } catch (error) {
    console.error('Error in fetchAllContests:', error);
  }
};

module.exports = {
  fetchAllContests,
  fetchCodeforcesContests,
  fetchCodechefContests,
  fetchLeetcodeContests
};




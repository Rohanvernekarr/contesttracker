const Contest = require('../models/Contest');

/**
 * Get all contests with filtering options
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getContests = async (req, res) => {
  try {
    const { platform, status } = req.query;
    const now = new Date();
    
    const filter = {};
    
    // Filter by platform if specified
    if (platform) {
      const platforms = platform.split(',');
      if (platforms.length > 0) {
        filter.platform = { $in: platforms };
      }
    }

    // If status is ongoing, modify the query to get contests that are currently ongoing
    if (status === 'ongoing') {
      filter.startTime = { $lte: now };
      filter.endTime = { $gte: now };
    }
    
    // Get contests based on filter
    let contests = await Contest.find(filter).sort({ startTime: 1 });
    
    // Calculate status dynamically based on current time
    contests = contests.map(contest => {
      const contestObj = contest.toObject();
      if (now < new Date(contest.startTime)) {
        contestObj.status = 'upcoming';
      } else if (now > new Date(contest.endTime)) {
        contestObj.status = 'past';
      } else {
        contestObj.status = 'ongoing';
      }
      return contestObj;
    });
    
    // Filter by status if specified
    if (status) {
      if (status === 'past') {
        // For past contests, get only the last 30
        contests = contests
          .filter(contest => contest.status === 'past')
          .sort((a, b) => new Date(b.endTime) - new Date(a.endTime))
          .slice(0, 30);
      } else if (status === 'ongoing') {
        // For ongoing contests, show all that are currently running
        contests = contests.filter(contest => contest.status === 'ongoing');
      } else {
        // For upcoming contests, show all
        contests = contests.filter(contest => contest.status === status);
      }
    }
    
    res.json({
      success: true,
      count: contests.length,
      data: contests
    });
  } catch (error) {
    console.error('Error in getContests:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * Get a single contest by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getContest = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    
    if (!contest) {
      return res.status(404).json({
        success: false,
        error: 'Contest not found'
      });
    }
    
    // Calculate status dynamically
    const now = new Date();
    const contestObj = contest.toObject();
    
    if (now < new Date(contest.startTime)) {
      contestObj.status = 'upcoming';
    } else if (now > new Date(contest.endTime)) {
      contestObj.status = 'past';
    } else {
      contestObj.status = 'ongoing';
    }
    
    res.json({
      success: true,
      data: contestObj
    });
  } catch (error) {
    console.error('Error in getContest:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

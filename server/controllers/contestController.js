const Contest = require('../models/Contest');

/**
 * Get all contests with filtering options
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getContests = async (req, res) => {
  try {
    const { platform, status } = req.query;
    
    const filter = {};
    
    // Filter by platform if specified
    if (platform) {
      const platforms = platform.split(',');
      if (platforms.length > 0) {
        filter.platform = { $in: platforms };
      }
    }
    
    // Filter by status if specified
    if (status) {
      filter.status = status;
    }
    
    const contests = await Contest.find(filter).sort({ startTime: 1 });
    
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
    
    res.json({
      success: true,
      data: contest
    });
  } catch (error) {
    console.error('Error in getContest:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

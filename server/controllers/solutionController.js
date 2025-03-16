const Solution = require('../models/Solution');
const Contest = require('../models/Contest');

/**
 * Get solution for a contest
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getSolution = async (req, res) => {
  try {
    const { contestId } = req.params;
    
    const solution = await Solution.findOne({ contestId });
    
    if (!solution) {
      return res.status(404).json({
        success: false,
        error: 'Solution not found'
      });
    }
    
    res.json({
      success: true,
      data: solution
    });
  } catch (error) {
    console.error('Error in getSolution:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * Add or update a solution
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.addSolution = async (req, res) => {
  try {
    const { contestId, youtubeUrl } = req.body;
    
    if (!contestId || !youtubeUrl) {
      return res.status(400).json({
        success: false,
        error: 'Please provide contestId and youtubeUrl'
      });
    }
    
    // Check if contest exists
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({
        success: false,
        error: 'Contest not found'
      });
    }
    
    // Find and update or create new solution
    const solution = await Solution.findOneAndUpdate(
      { contestId },
      { contestId, youtubeUrl, addedManually: true },
      { upsert: true, new: true }
    );
    
    res.status(201).json({
      success: true,
      data: solution
    });
  } catch (error) {
    console.error('Error in addSolution:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
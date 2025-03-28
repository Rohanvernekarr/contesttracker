const Bookmark = require('../models/Bookmark');
const Contest = require('../models/Contest');

/**
 * Get all bookmarks
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user.id }).populate('contestId');
    
    res.json({
      success: true,
      count: bookmarks.length,
      data: bookmarks.map(bookmark => bookmark.contestId)
    });
  } catch (error) {
    console.error('Error in getBookmarks:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * Add a bookmark
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.addBookmark = async (req, res) => {
  try {
    const { contestId } = req.body;
    
    if (!contestId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide contestId'
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
    
    // Check if bookmark already exists
    const existingBookmark = await Bookmark.findOne({ 
      contestId,
      userId: req.user.id 
    });
    if (existingBookmark) {
      return res.status(400).json({
        success: false,
        error: 'Bookmark already exists'
      });
    }
    
    const bookmark = await Bookmark.create({
      contestId,
      userId: req.user.id
    });
    
    res.status(201).json({
      success: true,
      data: contest
    });
  } catch (error) {
    console.error('Error in addBookmark:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * Remove a bookmark
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.removeBookmark = async (req, res) => {
  try {
    const { contestId } = req.params;
    
    const bookmark = await Bookmark.findOneAndDelete({ 
      contestId,
      userId: req.user.id 
    });
    
    if (!bookmark) {
      return res.status(404).json({
        success: false,
        error: 'Bookmark not found'
      });
    }
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error in removeBookmark:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

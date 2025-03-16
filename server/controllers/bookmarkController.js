const Bookmark = require('../models/Bookmark');
const Contest = require('../models/Contest');

/**
 * Get all bookmarks for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getBookmarks = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const bookmarks = await Bookmark.find({ userId }).populate('contestId');
    
    res.json({
      success: true,
      count: bookmarks.length,
      data: bookmarks
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
    const { userId, contestId } = req.body;
    
    if (!userId || !contestId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide userId and contestId'
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
    const existingBookmark = await Bookmark.findOne({ userId, contestId });
    if (existingBookmark) {
      return res.status(400).json({
        success: false,
        error: 'Bookmark already exists'
      });
    }
    
    const bookmark = await Bookmark.create({
      userId,
      contestId
    });
    
    res.status(201).json({
      success: true,
      data: bookmark
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
    const { userId, contestId } = req.params;
    
    const bookmark = await Bookmark.findOneAndDelete({ userId, contestId });
    
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

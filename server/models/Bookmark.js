const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contest',
    required: true
  }
}, { 
  timestamps: true,
  unique: true // This ensures a user can't bookmark the same contest twice
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);
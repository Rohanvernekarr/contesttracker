const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contest',
    required: true,
    unique: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Bookmark', BookmarkSchema);
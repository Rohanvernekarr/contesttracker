const mongoose = require('mongoose');

const SolutionSchema = new mongoose.Schema({
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contest',
    required: true
  },
  youtubeUrl: {
    type: String,
    required: true
  },
  addedManually: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Solution', SolutionSchema);
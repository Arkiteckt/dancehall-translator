const mongoose = require('mongoose');

const BountySchema = new mongoose.Schema({
  songId: {
    type: String,
    required: true
  },
  songTitle: {
    type: String,
    required: true
  },
  originalLyrics: {
    type: String,
    required: true
  },
  aiTranslation: {
    type: String,
    required: true
  },
  flaggedLines: [{
    lineNumber: Number,
    originalText: String,
    aiTranslation: String,
    confidenceScore: Number
  }],
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  bountyAmount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ['USDC', 'SOL', 'ETH'],
    default: 'USDC'
  },
  createdBy: {
    type: String,
    default: 'anonymous'
  },
  assignedTo: {
    type: String,
    default: null
  },
  humanTranslation: String,
  culturalNotes: String,
  completedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Bounty', BountySchema);
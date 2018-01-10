const mongoose = require('mongoose')

/**
 * Define `ReactionVote` Schema
 */

const ReactionVote = new mongoose.Schema({
  userId: { type: ObjectId, ref: 'User' },
  value: {}
}, { timestamps: true })

/**
 * Define Schema Indexes
 */

// Empty

/**
 * Expose `ReactionVote` Model
 */

module.exports = mongoose.model('ReactionVote', ReactionVote)

const mongoose = require('mongoose')
const METHODS = require('../enum/methods');
/**
 * Define `ReactionType` Schema
 */

const ReactionType = new mongoose.Schema({
    method: {
        type: String,
        enum: METHODS,
      },
    startingDate: Date,
    closingDate: Date,
}, { timestamps: true })

/**
 * Define Schema Indexes
 */

// Empty

/**
 * Expose `ReactionType` Model
 */

module.exports = mongoose.model('ReactionType', ReactionType)

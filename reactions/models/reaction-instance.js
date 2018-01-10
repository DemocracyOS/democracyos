const mongoose = require('mongoose')

/**
 * Define `ReactionInstance` Schema
 */

const ReactionInstance = new mongoose.Schema({
    reactionType: String,
    reactionId: { type: ObjectId, refPath: 'reactionType' },
    resourceType: String,
    resourceId: String,
    results: [{}]
}, { timestamps: true })

/**
 * Define Schema Indexes
 */

// Empty    

/**
 * Expose `ReactionInstance` Model
 */

module.exports = mongoose.model('Reaction', ReactionInstance)

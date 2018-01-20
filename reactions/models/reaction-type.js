const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const METHODS = require('../enum/methods')
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

ReactionType.plugin(mongoosePaginate)

/**
 * Expose `ReactionType` Model
 */

module.exports = mongoose.model('ReactionType', ReactionType)

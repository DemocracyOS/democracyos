const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const METHODS = require('../enum/methods')
/**
 * Define `ReactionType` Schema
 */

const ReactionType = new mongoose.Schema({
  name: String,
  method: {
    type: String,
    enum: METHODS
  },
  startingDate: Date,
  closingDate: Date,
  limit: String
}, { timestamps: true })

/**
 * Define Schema Indexes
 */

/**
* Model's Plugin Extensions
*/
ReactionType.plugin(mongoosePaginate)

/**
 * Expose `ReactionType` Model
 */

module.exports = mongoose.model('ReactionType', ReactionType)

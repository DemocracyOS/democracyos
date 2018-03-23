const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const METHODS = require('../enum/methods')
/**
 * Define `ReactionRule` Schema
 */

const ReactionRule = new mongoose.Schema({
  name: String,
  method: {
    type: String,
    enum: METHODS
  },
  startingDate: Date,
  closingDate: Date,
  limit: Number,
  options: {}
}, { timestamps: true })

/**
 * Define Schema Indexes
 */

/**
* Model's Plugin Extensions
*/
ReactionRule.plugin(mongoosePaginate)

/**
 * Expose `ReactionRule` Model
 */

module.exports = mongoose.model('ReactionRule', ReactionRule)

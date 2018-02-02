const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

/**
 * Define `ReactionInstance` Schema
 */

const ReactionInstance = new mongoose.Schema({
  reactionId: { type: mongoose.Schema.Types.ObjectId, refPath: 'reactionRule' },
  resourceType: String,
  resourceId: String,
  results: [{}]
}, { timestamps: true })

/**
 * Define Schema Indexes
 */
/**
* Model's Plugin Extensions
*/

ReactionInstance.plugin(mongoosePaginate)

/**
 * Expose `ReactionInstance` Model
 */

module.exports = mongoose.model('ReactionInstance', ReactionInstance)

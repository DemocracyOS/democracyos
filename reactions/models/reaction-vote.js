const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

/**
 * Define `ReactionVote` Schema
 */

const ReactionVote = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  value: {}
}, { timestamps: true })

/**
 * Define Schema Indexes
 */

/**
* Model's Plugin Extensions
*/

ReactionVote.plugin(mongoosePaginate)

/**
 * Expose `ReactionVote` Model
 */

module.exports = mongoose.model('ReactionVote', ReactionVote)

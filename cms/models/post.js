const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

/**
Define `Post` schema
*/

const Post = new mongoose.Schema({
  title: String,
  content: String,
  reactionId: String,
  author: String,
  openingDate: { type: Date },
  closingDate: { type: Date },
  tags: [String]
})

/**
 * Model's Plugin Extensions
 */

Post.plugin(mongoosePaginate)

/**
 * Expose `User` Model
 */

module.exports = mongoose.model('Post', Post)

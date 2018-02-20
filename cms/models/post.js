const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

/**
Define `Post` schema
*/

const Post = new mongoose.Schema({
  title: { type: String, maxLength: 120, required: true },
  description: { type: String, maxLength: 225 },
  content: { type: Object, required: true },
  author: { type: String },
  openingDate: { type: Date },
  closingDate: { type: Date }
}, { timestamps: true })

/**
 * Model's Plugin Extensions
 */

Post.plugin(mongoosePaginate)

/**
 * Expose `User` Model
 */

module.exports = mongoose.model('Post', Post)

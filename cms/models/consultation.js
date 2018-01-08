const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

/**
Define `Consultation` schema
*/

const Consultation = new mongoose.Schema({
  title: String,
  content: String,
  reactionId: String,
  author: String,
  openingDate: {type: Date},
  closingDate: {type: Date},
  tags: [String]
})

/**
 * Model's Plugin Extensions
 */

Consultation.plugin(mongoosePaginate)

/**
 * Expose `User` Model
 */

module.exports = mongoose.model('Consultation', Consultation)

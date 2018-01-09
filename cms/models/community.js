const mongoose = require('mongoose')

/**
 * Define `Community` Schema
 */

const Community = new mongoose.Schema({
  communityName: String,
  logo: url,
  permissions: String,
  theme: String
}, { timestamps: true })


/**
 * Expose `Community` Model
 */

module.exports = mongoose.model('Community', Community)

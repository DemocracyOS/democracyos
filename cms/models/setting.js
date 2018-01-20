const mongoose = require('mongoose')

/**
 * Define `Settings` Schema
 */

const Settings = new mongoose.Schema({
  communityName: String,
  logo: String,
  permissions: String,
  theme: String
}, { timestamps: true })

/**
 * Expose `Settings` Model
 */

module.exports = mongoose.model('Settings', Settings)

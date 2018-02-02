const mongoose = require('mongoose')

/**
 * Define `Settings` Schema
 */

const Setting = new mongoose.Schema({
  settingName: String,
  logo: String,
  permissions: String,
  theme: String
}, { timestamps: true })

/**
 * Expose `Settings` Model
 */

module.exports = mongoose.model('Setting', Setting)

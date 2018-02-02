const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

/**
 * Define `Setting` Schema
 */


const Setting = new mongoose.Schema({
  settingName: String,
  logo: String,
  permissions: String,
  theme: String
}, { timestamps: true })



/**
 * Define Schema Indexes
 */

User.index({ email: 1 }, { unique: true })
User.index({ username: 1 }, { unique: true })

/**
 * Model's Plugin Extensions
 */

Setting.plugin(mongoosePaginate)

/**
 * Expose `Setting` Model
 */

module.exports = mongoose.model('Setting', Setting)

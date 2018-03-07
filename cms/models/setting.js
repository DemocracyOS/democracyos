const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

/**
 * Define `Settings` Schema
 */

const Setting = new mongoose.Schema({
  communityName: String,
  logo: String,
  mainColor: String
}, { timestamps: true })

/**
 * Model's Plugin Extensions
 */

Setting.plugin(mongoosePaginate)

/**
 * Expose `Setting` Model
 */

module.exports = mongoose.model('Setting', Setting)

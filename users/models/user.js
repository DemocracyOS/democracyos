const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

/**
 * Define `User` Schema
 */

const User = new mongoose.Schema({
  username: String,
  name: String,
  bio: String,
  email: String,
  emailToken: String,
  role: String,
  emailVerified: { type: Boolean, default: false },
  firstLogin: { type: Boolean, default: true },
  facebook: {
    id: String,
    accessToken: String,
    refreshToken: String
  },
  google: {
    id: String,
    accessToken: String,
    refreshToken: String
  },
  twitter: {
    id: String,
    accessToken: String,
    refreshToken: String
  },
  linkedin: {
    id: String,
    accessToken: String,
    refreshToken: String
  },
  instagram: {
    id: String,
    accessToken: String,
    refreshToken: String
  }
}, { timestamps: true })

/**
 * Define Schema Indexes
 */

User.index({ email: 1 }, { unique: true })
// User.index({ username: 1 }, { unique: true })

/**
 * Model's Plugin Extensions
 */

User.plugin(mongoosePaginate)

/**
 * Expose `User` Model
 */

module.exports = mongoose.model('User', User)

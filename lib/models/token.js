var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId

var TokenSchema = new Schema({
  user: { type: ObjectId, required: true, ref: 'User' },
  scope: { type: String, enum: ['password-reset', 'email-validation'], required: true },
  meta: { type: Object },
  createdAt: { type: Date, default: Date.now }
})

TokenSchema.index({ createdAt: -1 })
TokenSchema.index({ scope: -1 })
TokenSchema.index({ user: -1 })

module.exports = function initialize (conn) {
  return conn.model('Token', TokenSchema)
}

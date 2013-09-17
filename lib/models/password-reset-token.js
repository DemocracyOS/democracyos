var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

/*
  PasswordResetToken Schema
 */
var PasswordResetTokenSchema = new Schema({
    user:     { type: ObjectId, required: true, ref: 'Citizen' }
  , createdAt:  { type: Date, default: Date.now }
});

PasswordResetTokenSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PasswordResetToken', PasswordResetTokenSchema);
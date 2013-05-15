var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var TagSchema = new Schema({
    hash: { type: String, lowercase: true, trim: true, unique: true, required: true }
  , createdAt: { type: Date, default: Date.now }
  , updatedAt: { type: Date }
});

TagSchema.index({ hash: 1 }, { unique: true});

module.exports = mongoose.model('Tag', TagSchema);
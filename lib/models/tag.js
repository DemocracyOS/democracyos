var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var TagSchema = new Schema({
    hash: { type: String, lowercase: true, trim: true }
  , createdAt: { type: Date, default: Date.now }
  , updatedAt: { type: Date }
});

TagSchema.index({ hash:1, createdAt: 1 });

module.exports = mongoose.model('Tag', TagSchema);
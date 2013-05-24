var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , log = require('debug')('models:tag');

var TagSchema = new Schema({
    hash: { type: String, lowercase: true, trim: true, required: true }
  , createdAt: { type: Date, default: Date.now }
});

TagSchema.index({ hash: 1 }, { unique: true, dropDups: true });

var Tag = module.exports = mongoose.model('Tag', TagSchema);

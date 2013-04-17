var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var TagSchema = new Schema({
    hash: { type: String }
  , title: { type: String }
  , createdAt: { type: Date, default: Date.now }
  , updatedAt: { type: Date }
});

module.exports = mongoose.model('Tag', TagSchema);
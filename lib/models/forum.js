/**
* Extend module's NODE_PATH
* HACK: temporary solution
*/

require('node-path')(module);

/**
* Module dependencies.
*/

var mongoose = require('mongoose');
var regexps = require('lib/regexps');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

/*
 * Forum Schema
 */

var ForumSchema = new Schema({
  name: {
    type: String,
    index: true,
    required: true,
    unique: true,
    trim: true,
    lowecase: true,
    match: regexps.forum.name
  },
  title: { type: String, required: true, trim: true },
  summary: { type: String, trim: true },
  imageUrl: { type: String },
  owner: { type: ObjectId, required: true, unique: true, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date }
});

ForumSchema.index({ owner: -1 });
ForumSchema.index({ name: -1 });

/**
 * Make Schema `.toObject()` and
 * `.toJSON()` parse getters for
 * proper JSON API response
 */

ForumSchema.set('toObject', { getters: true });
ForumSchema.set('toJSON', { getters: true });

module.exports = function initialize(conn) {
  return conn.model('Forum', ForumSchema);
};

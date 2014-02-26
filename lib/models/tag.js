/**
 * Extend module's NODE_PATH
 * HACK: temporary solution
 */

require('node-path')(module);

/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var log = require('debug')('democracyos:models:tag');
var tagImages = require('lib/tag-images');
var images = Object.keys(tagImages);
var regex = require('lib/regexps');

var hexColorValidation = [hexColorValidator, 'Invalid hex color value'];
function hexColorValidator(value) {
	return regex.hexColor.test(value);
}

var TagSchema = new Schema({
    hash: { type: String, lowercase: true, trim: true, required: true }
  , name: { type: String, trim: true, required: true }
  , color: { type: String, default: '#091A33', validate: hexColorValidation }
  , image: { type: String, enum: images, default: images[0] }
  , createdAt: { type: Date, default: Date.now }
});

/**
 * Define Schema Indexes for MongoDB
 */

TagSchema.index({ createdAt: -1 });
TagSchema.index({ hash: 1 }, { unique: true, dropDups: true });

/**
 * Make Schema `.toObject()` and
 * `.toJSON()` parse getters for
 * proper JSON API response
 */

TagSchema.set('toObject', { getters: true });
TagSchema.set('toJSON', { getters: true });

var Tag = module.exports = mongoose.model('Tag', TagSchema);
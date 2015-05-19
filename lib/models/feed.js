/**
* Module dependencies.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Define `Feed` Schema
 */

var types = [
  'law-published',
  'new-comment',
  'new-vote'
];

var FeedSchema = new Schema({
    type: { type: String, enum: types, required: true }
  , forum: { type: Schema.ObjectId, ref: 'Forum' }
  , data: { type: Schema.Types.Mixed, required: true }
  , createdAt: { type: Date }
});

FeedSchema.index({ createdAt: 1 });
FeedSchema.index({ forum: 1 });

module.exports = function initialize(conn) {
  return conn.model('Feed', FeedSchema);
};

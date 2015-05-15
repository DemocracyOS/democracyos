/**
* Module dependencies.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Define `Feed` Schema
 */

var types = [
  'law-published'
];

var FeedSchema = new Schema({
    type: { type: String, enum: types, required: true }
  , deploymentId: { type: Schema.ObjectId, ref: 'Deployment' }
  , data: { type: Schema.Types.Mixed, required: true }
  , url: { type: String, required: true }
  , feededAt: { type: Date }
});

FeedSchema.index({ law: 1 });
FeedSchema.index({ type: 1 });
FeedSchema.index({ feededAt: 1 });
FeedSchema.index({ deploymentId: 1 });

module.exports = function initialize(conn) {
  return conn.model('Feed', FeedSchema);
};

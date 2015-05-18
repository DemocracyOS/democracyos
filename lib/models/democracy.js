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

/**
 * Democracy Statuses
 */

var statuses = [
  'creating',
  'destroying',
  'ready'
];

/*
 * Democracy Schema
 */

var DemocracySchema = new Schema({
    name: {
    type: String,
    index: true,
    required: true,
    unique: true,
    trim: true,
    lowecase: true,
    // String, between 1~80 chars, alphanumeric or `-`, not starting nor finishing with `-`.
    match: /^([a-zA-Z0-9]{1,2}|[a-zA-Z0-9][a-zA-Z0-9\-]{1,78}[a-zA-Z0-9])$/
  },
  deisId:    { type: String },
  url:       { type: String },
  title:     { type: String, required: true, trim: true },
  summary:   { type: String, trim: true },
  imageUrl:  { type: String },
  mongoUrl:  { type: String },
  owner:     { type: ObjectId, required: true, unique: true, ref: 'User' },
  status:    { type: String, required: true, enum: statuses },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date }
});

DemocracySchema.index({ owner: -1 });
DemocracySchema.index({ name: -1 });

/**
 * Make Schema `.toObject()` and
 * `.toJSON()` parse getters for
 * proper JSON API response
 */

DemocracySchema.set('toObject', { getters: true });
DemocracySchema.set('toJSON', { getters: true });

module.exports = function initialize(conn) {
  return conn.model('Democracy', DemocracySchema);
};

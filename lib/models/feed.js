/**
 * Extend module's NODE_PATH
 * HACK: temporary solution
 */

require('node-path')(module);

/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var types = [
      'comment'
    , 'delegation'
    , 'vote'
    , 'issue-submit'
    , 'idea-submit'
  ];

var FeedSchema = new Schema({

  // Types of Feed
    action: { type: String, enum: types }

  // Feed was performed by Citizen with id
  , citizen:  { type: ObjectId, ref: 'Citizen' }

  // Feed was performed by Citizen with id
  , proposal:  { type: ObjectId, ref: 'Proposal' }

  // Feed refers to Delegation with id
  , delegation: { type: ObjectId, ref: 'Delegation' }

  // Feed refers to Comment with id
  , comment:  { type: ObjectId }

  // Object of metadata with format according to each feed needs
  , meta:     {}

  , createdAt: { type: Date, default: Date.now }
});

// Ensures index on mongodb for query search
FeedSchema.index({ createdAt:-1, citizen:1 });


module.exports = mongoose.model('Feed', FeedSchema);
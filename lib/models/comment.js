/**
 * Extend module's NODE_PATH
 * HACK: temporary solution
 */

var resolve = require('path').resolve;
require(resolve('lib/node-path'))(module);

/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

/*
 * Comment Reply Schema
 */
var CommentReplySchema = new Schema({
    author: {type: ObjectId, required: true, ref: 'Citizen'}
  , text: {type: String}
  , createdAt: {type: Date, default: Date.now}
});

/*
 * Comment Schema
 */
var CommentSchema = new Schema({
    author:     { type: ObjectId, required: true, ref: 'Citizen' }
  , text:       { type: String, required: true }
  , replies:    [ CommentReplySchema ]

  // Referente to the ObjectId of the Discussion Context
  , reference:  { type: ObjectId, required: true }
  // Discussion Context
  , context:    { type: String, required: true, enum: ['proposal', 'law'] }

  , createdAt:  { type: Date, default: Date.now }
});

CommentSchema.index({ createdAt: -1 });
CommentSchema.index({ reference: -1, context: -1 });

CommentSchema.set('toObject', { getters: true });
CommentSchema.set('toJSON', { getters: true });

CommentSchema.post('save', function(comment) {
  var Element = this.context.charAt(0).toUpperCase() + this.context.slice(1);

  try {
    Element = this.model(Element);
  } catch (err) {
    console.log(err);
    return;
  }
  
  Element.findById(this.reference, function(err, element) {
    if (!element.participants) return;
    element.participants.addToSet(comment.author);
    comment.replies.forEach(function(reply) {
      element.participants.addToSet(reply.author);
    });

    if(element.isModified()) {
      element.save(function(err) {
        if(err) console.log(err);
      });
    }
  });
});

module.exports = mongoose.model('Comment', CommentSchema);
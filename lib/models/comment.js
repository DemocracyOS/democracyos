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
  , ObjectId = Schema.ObjectId
  , log = require('debug')('democracyos:comment-model');

/**
 * Comment Vote Schema
 */

var Vote = new Schema({
    author: { type: ObjectId, ref: 'Citizen', required: true }
  , value: { type: String, enum: [ "positive", "negative" ], required: true }
  , createdAt: { type: Date, default: Date.now }
});

/**
 * Comment Flag Schema
 */

var Flag = new Schema({
    author: { type: ObjectId, ref: 'Citizen', required: true }
  , value: { type: String, enum: [ "spam" ], required: true }
  , createdAt: { type: Date, default: Date.now }
});

/*
 * Comment Reply Schema
 */

var CommentReplySchema = new Schema({
    author: {type: ObjectId, required: true, ref: 'Citizen'}
  , text: {type: String}
  , createdAt: {type: Date, default: Date.now}
});

function minTextValidator(text) {
  return text.length;
}

function maxTextValidator(text) {
  return text.length <= 4096;
}

var commentValidator = [
    { validator: minTextValidator, msg: 'Argument cannot be empty' }
  , { validator: maxTextValidator, msg: 'Argument is limited to 4096 characters' }
]

/**
 * Reduces multiple line breaks to a single one
 * 
 * @param {String} text
 * @return {String} reduced string
 * @api private
 */

function reduceLB(text) {
  return text.replace(/\n\n+/g, "\n");
}

/*
 * Comment Schema
 */
var CommentSchema = new Schema({
    author:     { type: ObjectId, required: true, ref: 'Citizen' }
  , text:       { type: String, validate: commentValidator, trim: true, required: true, set: reduceLB }
  , replies:    [ CommentReplySchema ]

  // Referente to the ObjectId of the Discussion Context
  , reference:  { type: ObjectId, required: true }
  // Discussion Context
  , context:    { type: String, required: true, enum: ['proposal', 'law'] }
  , votes:      [ Vote ]
  , flags:      [ Flag ]
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

/**
 * Get `positive` votes
 *
 * @return {Array} voters
 * @api public
 */

CommentSchema.virtual('upvotes').get(function() {
  return this.votes.filter(function(v) {
    return "positive" === v.value;
  });
});

/**
 * Get `negative` votes
 *
 * @return {Array} voters
 * @api public
 */

CommentSchema.virtual('downvotes').get(function() {
  return this.votes.filter(function(v) {
    return "negative" === v.value;
  });
});

/**
 * Vote Comment with provided citizen
 * and voting value
 *
 * @param {Citizen|ObjectId|String} citizen
 * @param {String} value
 * @param {Function} cb
 * @api public
 */

CommentSchema.methods.vote = function(citizen, value, cb) {  
  var vote = { author: citizen, value: value };
  this.unvote(citizen);
  this.votes.push(vote);
  this.save(cb);
};

/**
 * Unvote Comment from provided citizen
 *
 * @param {Citizen|ObjectId|String} citizen
 * @param {Function} cb
 * @api public
 */

CommentSchema.methods.unvote = function(citizen, cb) {
  var votes = this.votes;
  var c = citizen.get ? citizen.get('_id') : citizen;

  var voted = votes.filter(function(v) {
    var a = v.author.get ? v.author.get('_id') : v.author;
    return a.equals
      ? a.equals(c)
      : a === c;
  });

  log('About to remove votes %j', voted);
  voted.length && voted.forEach(function(v) {
    var removed = votes.id(v.id).remove();
    log('Remove vote %j', removed);
  });

  if (cb) this.save(cb);
};

/**
 * Flag Comment with provided citizen
 * and flag value
 *
 * @param {Citizen|ObjectId|String} citizen
 * @param {String} value
 * @param {Function} cb
 * @api public
 */

CommentSchema.methods.flag = function(citizen, value, cb) {  
  var flag = { author: citizen, value: value };
  this.unflag(citizen);
  this.flags.push(flag);
  this.save(cb);
};

/**
 * Unflag Comment from provided citizen
 *
 * @param {Citizen|ObjectId|String} citizen
 * @param {Function} cb
 * @api public
 */

CommentSchema.methods.unflag = function(citizen, cb) {
  var flags = this.flags;
  var c = citizen.get ? citizen.get('_id') : citizen;

  var flagged = flags.filter(function(v) {
    var a = v.author.get ? v.author.get('_id') : v.author;
    return a.equals
      ? a.equals(c)
      : a === c;
  });

  log('About to remove flags %j', flagged);
  flagged.length && flagged.forEach(function(v) {
    var removed = flags.id(v.id).remove();
    log('Remove vote %j', removed);
  });

  if (cb) this.save(cb);
};

module.exports = mongoose.model('Comment', CommentSchema);
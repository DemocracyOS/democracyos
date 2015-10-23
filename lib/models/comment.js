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
    author: { type: ObjectId, ref: 'User', required: true }
  , value: { type: String, enum: [ "positive", "negative" ], required: true }
  , createdAt: { type: Date, default: Date.now }
});

/**
 * Comment Flag Schema
 */

var Flag = new Schema({
    author: { type: ObjectId, ref: 'User', required: true }
  , value: { type: String, enum: [ "spam" ], required: true }
  , createdAt: { type: Date, default: Date.now }
});

var replyValidator = [
    { validator: minTextValidator, msg: 'comments.reply-cannot-be-empty' }
  , { validator: maxTextValidator, msg: 'comments.argument-limited' }
];

/*
 * Comment Reply Schema
 */

var CommentReplySchema = new Schema({
    author: {type: ObjectId, required: true, ref: 'User'}
  , text: {type: String, validate: replyValidator, required: true }
  , createdAt: { type: Date, default: Date.now }
  , editedAt: { type: Date }
});

function minTextValidator(text) {
  return text.length;
}

function maxTextValidator(text) {
  return text.length <= 4096;
}

var commentValidator = [
    { validator: minTextValidator, msg: 'comments.cannot-be-empty' }
  , { validator: maxTextValidator, msg: 'comments.argument-limited' }
];

/**
 * Reduces multiple line breaks to a single one
 *
 * @param {String} text
 * @return {String} reduced string
 * @api private
 */

function reduceLB(text) {
  return text.replace(/\n{3,}/g, "\n\n");
}

/*
 * Comment Schema
 */
var CommentSchema = new Schema({
    author:     { type: ObjectId, required: true, ref: 'User' }
  , text:       { type: String, validate: commentValidator, trim: true, required: true, set: reduceLB }
  , replies:    [ CommentReplySchema ]
  // Reference to the ObjectId of the Discussion Context
  , reference:  { type: Schema.Types.Mixed, required: true }
  // Discussion Context
  , context:    { type: String, required: true, enum: ['proposal', 'topic', 'clause', 'body', 'paragraph'] }
  // If the context is clause or body, we save a reference to the topic to get the Side Comments of a Topic
  // in a straightforward way
  , topicId:    { type: ObjectId }
  , votes:      [ Vote ]
  , score:      { type: Number, default: 0 }
  , flags:      [ Flag ]
  , createdAt:  { type: Date, default: Date.now }
  , editedAt:   { type: Date }
});

CommentSchema.index({ createdAt: -1 });
CommentSchema.index({ score: -1 });
CommentSchema.index({ reference: -1, context: -1 });

CommentSchema.set('toObject', { getters: true });
CommentSchema.set('toJSON', { getters: true });

CommentSchema.post('save', function(comment) {
  if ('body' != this.context && 'clause' != this.context) {
    var Element = this.context.charAt(0).toUpperCase() + this.context.slice(1);

    try {
      Element = this.model(Element);
    } catch (err) {
      console.log(err);
      return;
    }

    Element.findById(this.reference, function(err, element) {
      if (!element || !element.participants) return;
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
  }
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
 * Vote Comment with provided user
 * and voting value
 *
 * @param {User|ObjectId|String} user
 * @param {String} value
 * @param {Function} cb
 * @api public
 */

CommentSchema.methods.vote = function(user, value, cb) {
  var vote = { author: user, value: value };
  this.unvote(user);
  this.votes.push(vote);
  this.score = this.upvotes.length - this.downvotes.length;
  this.save(cb);
};

/**
 * Unvote Comment from provided user
 *
 * @param {User|ObjectId|String} user
 * @param {Function} cb
 * @api public
 */

CommentSchema.methods.unvote = function(user, cb) {
  var votes = this.votes;
  var c = user.get ? user.get('_id') : user;

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
 * Flag Comment with provided user
 * and flag value
 *
 * @param {User|ObjectId|String} user
 * @param {String} value
 * @param {Function} cb
 * @api public
 */

CommentSchema.methods.flag = function(user, value, cb) {
  var flag = { author: user, value: value };
  this.unflag(user);
  this.flags.push(flag);
  this.save(cb);
};

/**
 * Unflag Comment from provided user
 *
 * @param {User|ObjectId|String} user
 * @param {Function} cb
 * @api public
 */

CommentSchema.methods.unflag = function(user, cb) {
  var flags = this.flags;
  var c = user.get ? user.get('_id') : user;

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

module.exports = function initialize(conn) {
  return conn.model('Comment', CommentSchema);
};

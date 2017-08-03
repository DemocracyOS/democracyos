var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId
var log = require('debug')('democracyos:comment-model')

/**
 * Comment Vote Schema
 */

var Vote = new Schema({
  author: { type: ObjectId, ref: 'User', required: true },
  value: { type: String, enum: [ 'positive', 'negative' ], required: true },
  createdAt: { type: Date, default: Date.now }
})

/**
 * Comment Flag Schema
 */

var Flag = new Schema({
  author: { type: ObjectId, ref: 'User', required: true },
  value: { type: String, enum: [ 'spam' ], required: true },
  createdAt: { type: Date, default: Date.now }
})

var replyValidator = [
  { validator: minTextValidator, msg: 'comments.reply-cannot-be-empty' },
  { validator: maxTextValidator, msg: 'comments.argument-limited' }
]

/*
 * Comment Reply Schema
 */

var CommentReplySchema = new Schema({
  author: { type: ObjectId, required: true, ref: 'User' },
  text: { type: String, validate: replyValidator, required: true },
  createdAt: { type: Date, default: Date.now },
  editedAt: { type: Date }
})

function minTextValidator (text) {
  return text.length
}

function maxTextValidator (text) {
  return text.length <= 4096
}

var commentValidator = [
  { validator: minTextValidator, msg: 'comments.cannot-be-empty' },
  { validator: maxTextValidator, msg: 'comments.argument-limited' }
]

/**
 * Reduces multiple line breaks to a single one
 *
 * @param {String} text
 * @return {String} reduced string
 * @api private
 */

function reduceLB (text) {
  return text.replace(/\n{3,}/g, '\n\n')
}

/*
 * Comment Schema
 */
var CommentSchema = new Schema({
  author: { type: ObjectId, required: true, ref: 'User' },
  text: { type: String, validate: commentValidator, trim: true, required: true, set: reduceLB },
  replies: [ CommentReplySchema ],
  // Reference to the ObjectId of the Discussion Context
  reference: { type: Schema.Types.Mixed, required: true },
  // Discussion Context
  context: { type: String, required: true, enum: ['proposal', 'topic', 'clause', 'body', 'paragraph'] },
  // If the context is clause or body, we save a reference to the topic to get the Side Comments of a Topic
  // in a straightforward way
  topicId: { type: ObjectId },
  votes: [ Vote ],
  score: { type: Number, default: 0 },
  flags: [ Flag ],
  createdAt: { type: Date, default: Date.now },
  editedAt: { type: Date }
})

CommentSchema.index({ createdAt: -1 })
CommentSchema.index({ score: -1 })
CommentSchema.index({ reference: -1, context: -1 })

CommentSchema.set('toObject', { getters: true })
CommentSchema.set('toJSON', { getters: true })

/**
 * Get `positive` votes
 *
 * @return {Array} voters
 * @api public
 */

CommentSchema.virtual('upvotes').get(function () {
  return this.votes.filter(function (v) {
    return v.value === 'positive'
  })
})

/**
 * Get `negative` votes
 *
 * @return {Array} voters
 * @api public
 */

CommentSchema.virtual('downvotes').get(function () {
  return this.votes.filter(function (v) {
    return v.value === 'negative'
  })
})

/**
 * Get `replies` count
 *
 * @return {Int} replies count
 * @api public
 */

CommentSchema.virtual('repliesCount').get(function () {
  return this.replies.length
})

/**
 * Vote Comment with provided user
 * and voting value
 *
 * @param {User|ObjectId|String} user
 * @param {String} value
 * @param {Function} cb
 * @api public
 */

CommentSchema.methods.vote = function (user, value, cb) {
  var vote = { author: user, value: value }
  this.unvote(user)
  this.votes.push(vote)
  this.score = this.upvotes.length - this.downvotes.length
  this.save(cb)
}

CommentSchema.methods.voteOf = function voteOf (user) {
  if (!user) return undefined

  const userId = user.get ? user.get('_id') : user

  return this.votes.find(function (vote) {
    const authorId = vote.author.get ? vote.author.get('_id') : vote.author
    return authorId.equals ? authorId.equals(userId) : authorId === userId
  })
}

/**
 * Unvote Comment from provided user
 *
 * @param {User|ObjectId|String} user
 * @param {Function} cb
 * @api public
 */

CommentSchema.methods.unvote = function (user, cb) {
  var votes = this.votes
  var c = user.get ? user.get('_id') : user

  var voted = votes.filter(function (v) {
    var a = v.author.get ? v.author.get('_id') : v.author
    return a.equals ? a.equals(c) : a === c
  })

  if (voted.length > 0) {
    voted.forEach(function (v) {
      var removed = votes.id(v.id).remove()
      log('Remove vote %j', removed)
    })

    this.score = this.upvotes.length - this.downvotes.length
  }

  if (cb) this.save(cb)
}

/**
 * Flag Comment with provided user
 * and flag value
 *
 * @param {User|ObjectId|String} user
 * @param {String} value
 * @param {Function} cb
 * @api public
 */

CommentSchema.methods.flag = function (user, value, cb) {
  var c = user.get ? user.get('_id') : user
  var flag = { author: c, value: value }
  this.unflag(user)
  this.flags.push(flag)
  this.save(cb)
}

/**
 * Unflag Comment from provided user
 *
 * @param {User|ObjectId|String} user
 * @param {Function} cb
 * @api public
 */

CommentSchema.methods.unflag = function (user, cb) {
  var flags = this.flags
  var c = user.get ? user.get('_id') : user

  var flagged = flags.filter(function (v) {
    var a = v.author.get ? v.author.get('_id') : v.author
    return a.equals
      ? a.equals(c)
      : a === c
  })

  log('About to remove flags %j', flagged)
  flagged.length && flagged.forEach(function (v) {
    var removed = flags.id(v.id).remove()
    log('Remove vote %j', removed)
  })

  if (cb) this.save(cb)
}

module.exports = function initialize (conn) {
  return conn.model('Comment', CommentSchema)
}

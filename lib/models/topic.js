var mongoose = require('mongoose')
var validators = require('mongoose-validators')
var log = require('debug')('democracyos:models:topic')
var xss = require('lib/richtext').xssFilter({ video: true, image: true, link: true })

var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId

/**
 * Topic Vote Schema
 */

var Vote = new Schema({
  author: { type: ObjectId, ref: 'User', required: true },
  value: { type: String, enum: ['positive', 'negative', 'neutral'], required: true },
  trustee: { type: ObjectId, ref: 'User' },
  caster: { type: ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  democracy: { type: ObjectId, ref: 'Deployment' }
})

/**
 * Clause Schema
 */

var ClauseSchema = new Schema({
  clauseName: { type: String },
  order: { type: Number, required: true, default: 0 },
  text: { type: String, required: true, default: 'Undefined text' },
  centered: { type: Boolean, required: true, default: false }
})

ClauseSchema.methods.update = function update (data) {
  data = data || {}
  this.clauseName = data.clauseName || this.clauseName
  this.order = data.order || this.order
  this.text = data.text || this.text
}

mongoose.model('Clause', ClauseSchema)

/**
 * Link
 */

var LinkSchema = new Schema({
  text: { type: String },
  url: { type: String, validate: validators.isURL({ skipEmpty: true }), maxlength: 250 }
})

mongoose.model('Link', LinkSchema)

LinkSchema.methods.update = function update (data) {
  data = data || {}
  this.text = data.text || this.text
  this.url = data.url || this.url
}

/**
 * Paragraph Schema
 */

var ParagraphSchema = new Schema({
  markup: { type: String },
  position: { type: Number },
  empty: { type: Boolean, default: false }
})

mongoose.model('Paragraph', ParagraphSchema)

/**
 * Topic Schema
 */

var TopicSchema = new Schema({
  topicId: { type: String },
  tag: { type: ObjectId, ref: 'Tag', required: true },
  officialTitle: { type: String, required: false },
  mediaTitle: { type: String, required: false, maxlength: 225 },
  author: { type: String, maxlength: 100 },
  authorUrl: { type: String, validate: validators.isURL({ skipEmpty: true }), maxlength: 250 },
  source: { type: String, validate: validators.isURL({ skipEmpty: true }), maxlength: 250 },
  clauses: [ParagraphSchema],
  votes: [Vote],
  participants: [{ type: ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  closingAt: { type: Date },
  publishedAt: { type: Date },
  deletedAt: { type: Date },
  votable: { type: Boolean, required: true, default: true },
  bodyTruncationText: { type: String },
  links: [LinkSchema],
  forum: { type: ObjectId, ref: 'Forum', required: false },
  coverUrl: { type: String, maxlength: 250 },
  extra: Schema.Types.Mixed
})

/**
 * Define Schema Indexes for MongoDB
 */

TopicSchema.index({ createdAt: -1 })
TopicSchema.index({ closingAt: -1 })
TopicSchema.index({ participants: -1 })
TopicSchema.index({ tag: -1 })
TopicSchema.index({ topicId: -1 })

/**
 * Make Schema `.toObject()` and
 * `.toJSON()` parse getters for
 * proper JSON API response
 */

TopicSchema.set('toObject', { getters: true })
TopicSchema.set('toJSON', { getters: true })

TopicSchema.options.toObject.transform =
  TopicSchema.options.toJSON.transform = function (doc, ret) {
    if (ret.votes) delete ret.votes
    if (ret.upvotes) ret.upvotes = ret.upvotes.map(function (v) { return v.author })
    if (ret.downvotes) ret.downvotes = ret.downvotes.map(function (v) { return v.author })
    if (ret.abstentions) ret.abstentions = ret.abstentions.map(function (v) { return v.author })
    if (ret.clauses) ret.clauses = ret.clauses.sort(function (a, b) { return a.position - b.position })
  }

/**
 * -- Model's event hooks
 */

/**
 * Pre update modified time
 *
 * @api private
 */

TopicSchema.pre('save', function (next) {
  this.updatedAt = this.isNew ? this.createdAt : Date.now()
  this.body = xss(this.body)

  next()
})

/**
 * -- Model's API extension
 */

/**
 * Compile topicId to generate
 * a human readable title
 *
 * @return {String} clauses
 * @api public
 */

TopicSchema.virtual('title').get(function () {
  return this.topicId
})

/**
 * Compile clauses to render
 * text content
 *
 * @return {String} clauses
 * @api public
 */

TopicSchema.virtual('content').get(function () {
  if (!this.clauses) return
  return this.clauses.sort(function (a, b) {
    var sort = a.order - b.order
    sort = sort > 0 ? 1 : -1
    return sort
  }).map(function (c) {
    if (c.text) return (c.clauseName ? c.clauseName + ': ' : '') + c.text
  }).join('\n')
})

/**
 * Get `positive` votes
 *
 * @return {Array} voters
 * @api public
 */

TopicSchema.virtual('upvotes').get(function () {
  if (!this.votes) return
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

TopicSchema.virtual('downvotes').get(function () {
  if (!this.votes) return
  return this.votes.filter(function (v) {
    return v.value === 'negative'
  })
})

/**
 * Get `neutral` votes
 *
 * @return {Array} voters
 * @api public
 */

TopicSchema.virtual('abstentions').get(function () {
  if (!this.votes) return
  return this.votes.filter(function (v) {
    return v.value === 'neutral'
  })
})

/**
 * Get topic `status`
 *
 * @return {String} status
 * @api public
 */

TopicSchema.virtual('status').get(function () {
  if (!this.closingAt) return 'open'

  return this.closingAt.getTime() < Date.now()
    ? 'closed'
    : 'open'
})

/**
 * Wether the `topic` is open
 *
 * @return {Boolean} open
 * @api public
 */

TopicSchema.virtual('open').get(function () {
  return this.status === 'open'
})

/**
 * Wether the `topic` is closed
 *
 * @return {Boolean} closed
 * @api public
 */

TopicSchema.virtual('closed').get(function () {
  return this.status === 'closed'
})

/**
 * Wether the `topic` was deleted
 *
 * @return {Boolean} deleted
 * @api public
 */

TopicSchema.virtual('deleted').get(function () {
  return !!this.deletedAt
})

/**
 * Wether the `topic` is public
 *
 * @return {Boolean} public
 * @api public
 */

TopicSchema.virtual('public').get(function () {
  return !!this.publishedAt
})

/**
 * Wether the `topic` is draft
 *
 * @return {Boolean} draft
 * @api public
 */

TopicSchema.virtual('draft').get(function () {
  return !this.publishedAt
})

/**
 * Vote Topic with provided user
 * and voting value
 *
 * @param {User|ObjectId|String} user
 * @param {String} value
 * @param {Function} cb
 * @api public
 */

TopicSchema.methods.vote = function (user, value, cb) {
  if (this.status === 'recount') return cb(new Error('Voting is closed on recount.'))
  if (this.status === 'closed') return cb(new Error('Voting is closed.'))
  // Here we could provide a 5000ms tolerance (5s)
  // or something... to prevent false positives
  if (this.closingAt && (+new Date(this.closingAt) < +new Date())) return cb(new Error("Can't vote after closing date."))

  var vote = { author: user, value: value, caster: user }

  this.unvote(user, onunvote.bind(this))

  function onunvote (err) {
    if (err) {
      if (typeof cb === 'function') return cb(err)
      else throw err
    }

    this.votes.push(vote)

    // Add user as participant
    this.addParticipant(user)
    if (typeof cb === 'function') this.save(cb)
  }
}

/**
 * Add participant to topic
 *
 * @param {User|ObjectId|String} user
 * @param {Function} cb
 * @api public
 */

TopicSchema.methods.addParticipant = function (user, cb) {
  this.participants.addToSet(user)
  if (cb) this.save(cb)
}

/**
 * Unvote Topic from provided user
 *
 * @param {User|ObjectId|String} user
 * @param {Function} cb
 * @api public
 */

TopicSchema.methods.unvote = function (user, cb) {
  var votes = this.votes
  var c = user.get ? user.get('_id') : user

  var voted = votes.filter(function (v) {
    var a = v.author.get ? v.author.get('_id') : v.author
    return a.equals ? a.equals(c) : a === c
  })

  log('About to remove votes %j', voted)
  if (voted.length) {
    voted.forEach(function (v) {
      var removed = votes.id(v.id).remove()
      log('Remove vote %j', removed)
    })
  }

  if (typeof cb === 'function') this.save(cb)
}

/**
 * Check for vote status of user
 *
 * @param {User|ObjectId|String} user
 * @api public
 */

TopicSchema.methods.votedBy = function (user) {
  if (!user) return false

  var votes = this.votes
  var c = user.get ? user.get('_id') : user

  var voted = votes.filter(function (v) {
    var a = v.author.get ? v.author.get('_id') : v.author
    return a.equals ? a.equals(c) : a === c
  })

  return voted.length === 1
}

/**
 * Close topic to prevent future vote casts
 *
 * @param {Function} cb
 * @api public
 */

TopicSchema.methods.close = function (cb) {
  if (+new Date(this.closingAt) < +new Date()) {
    log('Deny to close topic before closing date.')
    return cb(new Error('Deny to close topic before closing date.'))
  }
  this.status = 'closed'
  if (cb) this.save(cb)
}

module.exports = function initialize (conn) {
  return conn.model('Topic', TopicSchema)
}

/**
 * Infers a topic version based on its structure
 * @return Number
 * @api private
 */

TopicSchema.methods.guessVersion = function guessVersion () {
  var topic = this
  log('Guessing version of topic %s', topic._id)
  var migratedClauses = topic.clauses.filter(function (clause) {
    return !!clause.markup
  })

  // Migrated and unmigrated clauses may coexist. Better catch it early.
  if (migratedClauses.length) {
    return 3
  }

  // Handle the case when a v1 topic has summary but no clauses
  if (topic._doc.summary && topic._doc.summary.toLowerCase().substring(0, 4) !== '<div') {
    return 1
  }

  if (topic.clauses[0] && topic.clauses[0]._doc && topic.clauses[0]._doc.clauseName) {
    log('Topic %s is v1 (very old stuff with clauses)')
    return 1
  } else if (topic.clauses[0] && topic.clauses[0]._doc && topic._doc.clauses[0]._doc.markup) {
    log('Topic %s is v3 (wrote with a rich text editor in DemocracyOS 1.0) or already migrated')
    return 3
  } else if (topic._doc.summary) {
    log('Topic %s is v2 (wrote with a rich text editor)')
    return 2
  } else {
    log("Can't guess topic version")
    return 3
  }
}

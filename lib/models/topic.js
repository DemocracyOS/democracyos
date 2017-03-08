const mongoose = require('mongoose')
const validators = require('mongoose-validators')
const log = require('debug')('democracyos:models:topic')
const richtext = require('lib/richtext')

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const xss = richtext.xssFilter({
  video: true,
  image: true,
  link: true
})

/**
 * Topic Vote Schema
 */

const Vote = new Schema({
  author: { type: ObjectId, ref: 'User', required: true },
  value: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    required: true
  },
  createdAt: { type: Date, default: Date.now }
})

/**
 * Topic Action Schema
 */

const ActionSchema = new Schema({
  method: { type: String, enum: ['vote', ''] },
  voteResults: [ Vote ]
})

mongoose.model('Action', ActionSchema)

/**
 * Link
 */

const LinkSchema = new Schema({
  text: String,
  url: {
    type: String,
    validate: validators.isURL({ skipEmpty: true }),
    maxlength: 250
  }
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

const ParagraphSchema = new Schema({
  markup: String,
  position: Number,
  empty: { type: Boolean, default: false }
})

mongoose.model('Paragraph', ParagraphSchema)

/**
 * Topic Schema
 */

const TopicSchema = new Schema({
  topicId: String,
  forum: { type: ObjectId, ref: 'Forum' },
  owner: { type: ObjectId, required: true, ref: 'User' },
  tag: { type: ObjectId, ref: 'Tag', required: true },
  officialTitle: String,
  mediaTitle: { type: String, maxlength: 225 },
  author: { type: String, maxlength: 100 },
  authorUrl: {
    type: String,
    validate: validators.isURL({ skipEmpty: true }),
    maxlength: 250
  },
  clauses: [ParagraphSchema],
  bodyTruncationText: String,
  links: [LinkSchema],
  source: {
    type: String,
    validate: validators.isURL({ skipEmpty: true }),
    maxlength: 250
  },
  coverUrl: { type: String, maxlength: 250 },
  action: ActionSchema,
  participants: [{ type: ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  closingAt: Date,
  publishedAt: Date,
  deletedAt: Date,
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

TopicSchema.options.toObject.transform = transform
TopicSchema.options.toJSON.transform = transform

function transform (doc, ret) {
  if (ret.upvotes) ret.upvotes = ret.upvotes.map((v) => v.author)
  if (ret.downvotes) ret.downvotes = ret.downvotes.map((v) => v.author)
  if (ret.abstentions) ret.abstentions = ret.abstentions.map((v) => v.author)

  if (ret.clauses) {
    ret.clauses = ret.clauses.sort((a, b) => a.position - b.position)
  }
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

TopicSchema.virtual('title').get(() => this.topicId)

/**
 * Compile clauses to render
 * text content
 *
 * @return {String} clauses
 * @api public
 */

TopicSchema.virtual('content').get(function () {
  if (!this.clauses) return

  return this.clauses.sort((a, b) => {
    return a.order - b.order > 0 ? 1 : -1
  }).map((c) => {
    if (c.text) return (c.clauseName ? c.clauseName + ': ' : '') + c.text
  }).join('\n')
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

TopicSchema.virtual('open').get(() => this.status === 'open')

/**
 * Wether the `topic` is closed
 *
 * @return {Boolean} closed
 * @api public
 */

TopicSchema.virtual('closed').get(() => this.status === 'closed')

/**
 * Close topic to prevent future vote casts
 *
 * @param {Function} cb
 * @api public
 */

TopicSchema.methods.close = function close (cb) {
  if (+new Date(this.closingAt) < +new Date()) {
    log('Deny to close topic before closing date.')
    return cb(new Error('Deny to close topic before closing date.'))
  }

  this.status = 'closed'

  if (cb) this.save(cb)
}

/**
 * Wether the `topic` was deleted
 *
 * @return {Boolean} deleted
 * @api public
 */

TopicSchema.virtual('deleted').get(() => !!this.deletedAt)

/**
 * Wether the `topic` is public
 *
 * @return {Boolean} public
 * @api public
 */

TopicSchema.virtual('public').get(() => !!this.publishedAt)

/**
 * Wether the `topic` is draft
 *
 * @return {Boolean} draft
 * @api public
 */

TopicSchema.virtual('draft').get(() => !this.publishedAt)

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
 * -- Model's voting API
 */

/**
 * Get `positive` votes
 *
 * @return {Array} voters
 * @api public
 */

TopicSchema.virtual('upvotes').get(function () {
  if (!this.action) return []

  return this.action.voteResults.filter((v) => v.value === 'positive')
})

/**
 * Get `negative` votes
 *
 * @return {Array} voters
 * @api public
 */

TopicSchema.virtual('downvotes').get(function () {
  if (!this.action) return []

  return this.action.voteResults.filter((v) => v.value === 'negative')
})

/**
 * Get `neutral` votes
 *
 * @return {Array} voters
 * @api public
 */

TopicSchema.virtual('abstentions').get(function () {
  if (!this.action) return []

  return this.action.voteResults.filter((v) => v.value === 'neutral')
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
  if (this.status === 'recount') {
    return cb(new Error('Voting is closed on recount.'))
  }

  if (this.status === 'closed') {
    return cb(new Error('Voting is closed.'))
  }

  // Here we could provide a 5000ms tolerance (5s)
  // or something... to prevent false positives
  if (this.closingAt && (+new Date(this.closingAt) < +new Date())) {
    return cb(new Error('Can\'t vote after closing date.'))
  }

  const vote = { author: user, value: value, caster: user }

  this.unvote(user, (err) => {
    if (err) {
      if (typeof cb === 'function') return cb(err)
      throw err
    }

    this.action.voteResults.push(vote)

    this.addParticipant(user)

    if (typeof cb === 'function') this.save(cb)
  })
}

/**
 * Unvote Topic from provided user
 *
 * @param {User|ObjectId|String} user
 * @param {Function} cb
 * @api public
 */

TopicSchema.methods.unvote = function (user, cb) {
  const votes = this.action.voteResults
  const c = user.get ? user.get('_id') : user

  const voted = votes.filter(function (v) {
    var a = v.author.get ? v.author.get('_id') : v.author
    return a.equals ? a.equals(c) : a === c
  })

  log('About to remove votes %j', voted)

  if (voted.length) {
    voted.forEach((v) => {
      const removed = votes.id(v.id).remove()
      log('Remove vote %j', v.id)
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
  if (!user || !this.action) return false

  const votes = this.action.voteResults

  const c = user.get ? user.get('_id') : user

  const voted = votes.filter(function (v) {
    const a = v.author.get ? v.author.get('_id') : v.author
    return a.equals ? a.equals(c) : a === c
  })

  return voted.length === 1
}

module.exports = function initialize (conn) {
  return conn.model('Topic', TopicSchema)
}

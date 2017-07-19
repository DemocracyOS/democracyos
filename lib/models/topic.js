const mongoose = require('mongoose')
const validators = require('mongoose-validators')
const log = require('debug')('democracyos:models:topic')
const getIdString = require('lib/utils').getIdString
const richtext = require('lib/richtext')

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

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
 * Topic Poll Schema
 */

const Poll = new Schema({
  author: { type: ObjectId, ref: 'User', required: true },
  value: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

/**
 * Topic Cause Schema
 */

const Cause = new Schema({
  author: { type: ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
})

/**
 * Topic Action Schema
 */

const ActionSchema = new Schema({
  method: { type: String, enum: ['vote', 'poll', 'cause', ''] },
  voteResults: [Vote],
  pollResults: [Poll],
  pollOptions: [String],
  causeResults: [Cause]
})

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

/**
 * Topic Schema
 */

const TopicSchema = new Schema({
  topicId: String,
  forum: { type: ObjectId, ref: 'Forum' },
  owner: { type: ObjectId, required: true, ref: 'User' },
  tag: { type: ObjectId, ref: 'Tag', required: true },
  tags: [{ type: String, maxlength: 100, minlength: 1 }],
  officialTitle: String,
  mediaTitle: { type: String, maxlength: 225 },
  author: { type: String, maxlength: 100 },
  authorUrl: {
    type: String,
    validate: validators.isURL({ skipEmpty: true }),
    maxlength: 250
  },
  clauses: [ParagraphSchema],
  links: [LinkSchema],
  source: {
    type: String,
    validate: validators.isURL({ skipEmpty: true }),
    maxlength: 250
  },
  coverUrl: { type: String, maxlength: 250 },
  action: ActionSchema,
  participants: [{ type: ObjectId, ref: 'User' }],
  participantsCount: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  closingAt: Date,
  publishedAt: Date,
  deletedAt: Date,
  extra: Schema.Types.Mixed,
  attrs: Schema.Types.Mixed
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

  if (!this.action.voteResults) this.action.voteResults = []
  if (!this.action.pollResults) this.action.pollResults = []
  if (!this.action.causeResults) this.action.causeResults = []

  next()
})

TopicSchema.pre('save', function (next) {
  if (!this.isModified('action.pollOptions')) return next()
  if (this.action.pollResults.length === 0) return next()

  const err = new Error('Poll options cannot be modified after a vote is casted.')

  next(err)
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
 * Add participant to topic
 *
 * @param {User|ObjectId|String} user
 * @param {Function} cb
 * @api public
 */

TopicSchema.methods.addParticipant = function (user, cb) {
  this.participants.addToSet(user)
  this.participantsCount = this.participants.length
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
  if (this.status === 'closed') return cb(new Error('Voting is closed.'))

  const vote = { author: user, value: value }

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
  const voter = getIdString(user)
  const vote = votes && votes.find((v) => getIdString(v.author) === voter)

  if (vote) {
    log('About to remove vote %j', vote && vote._id)
    votes.id(vote.id).remove()
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
  const voter = getIdString(user)
  const vote = votes && votes.find((v) => getIdString(v.author) === voter)

  return !!vote
}

/**
 * Poll Topic with provided user
 * and poll value
 *
 * @param {User|ObjectId|String} user
 * @param {String} value
 * @param {Function} cb
 * @api public
 */

TopicSchema.methods.poll = function (user, value, cb) {
  if (this.status === 'closed') return cb(new Error('Polling is closed.'))
  if (this.polledBy(user)) return cb(new Error('Can\'t poll twice.'))

  const poll = { author: user, value: value }

  if (this.action.pollResults && this.action.pollResults.length) {
    this.action.pollResults.push(poll)
  } else {
    this.action.pollResults = [poll]
  }

  this.addParticipant(user)

  if (typeof cb === 'function') this.save(cb)
}

/**
 * Check for vote status of user
 *
 * @param {User|ObjectId|String} user
 * @api public
 */

TopicSchema.methods.polledBy = function (user) {
  if (!user || !this.action) return false

  const votes = this.action.pollResults
  const voter = getIdString(user)
  const vote = votes && votes.find((v) => getIdString(v.author) === voter)

  return !!vote
}

/**
 * Support Topic with provided user
 * and poll value
 *
 * @param {User|ObjectId|String} user
 * @param {String} value
 * @param {Function} cb
 * @api public
 */

TopicSchema.methods.support = function (user, cb) {
  if (this.status === 'closed') return cb(new Error('Supporting is closed.'))
  if (this.supportedBy(user)) return cb(new Error('Can\'t support twice.'))

  const support = { author: user }

  if (this.action.causeResults && this.action.causeResults.length) {
    this.action.causeResults.push(support)
  } else {
    this.action.causeResults = [support]
  }

  this.addParticipant(user)

  if (typeof cb === 'function') this.save(cb)
}

/**
 * Check for cause support status of user
 *
 * @param {User|ObjectId|String} user
 * @api public
 */

TopicSchema.methods.supportedBy = function (user) {
  if (!user || !this.action) return false

  const votes = this.action.causeResults
  const voter = getIdString(user)
  const vote = votes && votes.find((v) => getIdString(v.author) === voter)

  return !!vote
}

TopicSchema.methods.isOwner = function (user) {
  if (!user) return false
  return getIdString(this.owner) === getIdString(user)
}

let hooks = null

try {
  hooks = require('ext/lib/hooks/topic')
} catch (err) {}

if (hooks) {
  if (!!~Object.keys(hooks).indexOf('post')) {
    TopicSchema.post('save', hooks['post'])
  }
  if (!!~Object.keys(hooks).indexOf('pre')) {
    TopicSchema.pre('save', hooks['pre'])
  }
}

module.exports = function initialize (conn) {
  return conn.model('Topic', TopicSchema)
}

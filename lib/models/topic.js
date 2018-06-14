const mongoose = require('mongoose')
const validators = require('mongoose-validators')
const log = require('debug')('democracyos:models:topic')
const getIdString = require('lib/utils').getIdString
const richtext = require('lib/richtext')
const Vote = require('lib/models').Vote

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const xss = richtext.xssFilter({
  video: true,
  image: true,
  link: true
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
  action: {
    method: { type: String, enum: ['vote', 'poll', 'cause', 'slider', 'hierarchy', ''] },
    results: { type: Array, default: [] },
    count: { type: Number, default: 0 }
  },
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

let hooks = null

try {
  hooks = require('ext/lib/hooks/topic')
} catch (err) {}

if (hooks) {
  if (Object.keys(hooks).includes('post')) {
    TopicSchema.post('save', hooks['post'])
  }
  if (Object.keys(hooks).includes('pre')) {
    TopicSchema.pre('save', hooks['pre'])
  }
}

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

TopicSchema.methods.isOwner = function (user) {
  if (!user) return false
  return getIdString(this.owner) === getIdString(user)
}

module.exports = function initialize (conn) {
  return conn.model('Topic', TopicSchema)
}

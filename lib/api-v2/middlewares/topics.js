const isEqual = require('lodash.isequal')
const filter = require('mout/object/filter')
const privileges = require('lib/privileges/topic')
const forumPrivileges = require('lib/privileges/forum')
const api = require('../db-api')

exports.privileges = Object.keys(privileges).reduce((middles, privilege) => {
  function middleware (req, res, next) {
    if (privileges[privilege](req.forum, req.user, req.topic)) return next()

    const err = new Error('User doesn\'t have enough privileges on topic.')
    err.status = 403
    err.code = 'LACK_PRIVILEGES'

    next(err)
  }

  middles[privilege] = middleware
  return middles
}, {})

function findWithId (req, res, next, id) {
  api.topics.find({ _id: id })
    .findOne()
    .exec()
    .then((topic) => {
      if (!topic) {
        const err = new Error(`Topic ${id} not found.`)
        err.status = 404
        err.code = 'TOPIC_NOT_FOUND'
        return next(err)
      }

      req.topic = topic

      next()
    })
    .catch(next)
}

exports.findById = function findById (req, res, next) {
  findWithId(req, res, next, req.params.id)
}

exports.findByTopicId = function findByTopicId (req, res, next) {
  findWithId(req, res, next, req.query.topicId)
}

exports.findFromComment = function findFromComment (req, res, next) {
  findWithId(req, res, next, req.comment.reference)
}

exports.findByBodyTopicId = function findByBodyTopicId (req, res, next) {
  findWithId(req, res, next, req.body.topicId)
}

exports.findAllFromForum = function findAllFromForum (req, res, next) {
  const id = req.forum.id

  api.topics.find({ forum: id })
    .exec()
    .then((topics) => {
      if (!topics) {
        const err = new Error(`Topics from Forum ${id} not found.`)
        err.status = 404
        err.code = 'TOPICS_NOT_FOUND'
        return next(err)
      }

      req.topics = topics

      next()
    })
    .catch(next)
}

const updatableKeys = [
  'action.method',
  'action.results',
  'author',
  'authorUrl',
  'clauses',
  'closingAt',
  'coverUrl',
  'links',
  'mediaTitle',
  'source',
  'tag',
  'tags',
  'topicId'
]

exports.parseUpdateableKeys = function parseUpdateableKeys (req, res, next) {
  const custom = (req.forum.topicsAttrs || []).map((attr) => {
    return `attrs.${attr.name}`
  })

  const updatable = updatableKeys.concat(custom)

  if (req.topic && req.topic.action.count > 0 && typeof req.body['action.method'] !== 'undefined' && req.topic.action.method !== req.body['action.method']) {
    const err = new Error("Can't change method after votes casted")
    next(err)
  }

  if (req.topic && req.topic.action.count > 0 && !isEqual(req.topic.action.options, req.body['action.options'])) {
    const err = new Error("Can't change options after votes casted")
    next(err)
  }

  if (req.topic && req.topic.action.count === 0) {
    switch (req.body['action.method']) {
      case 'vote':
        req.body['action.results'] = [
          { value: 'positive', percentage: 0, votes: 0 },
          { value: 'neutral', percentage: 0, votes: 0 },
          { value: 'negative', percentage: 0, votes: 0 }
        ]
        break
      case 'poll':
      case 'hierarchy':
        if (!req.body['action.options']) {
          return new Error("Can't create a poll without options")
        }
        req.body['action.results'] = req.body['action.options'].map((o) => ({ value: o, percentage: 0, votes: 0 }))
        delete req.body['action.options']
        break
      case 'cause':
        req.body['action.results'] = [{ value: 'support', percentage: 0, votes: 0 }]
        break
      case 'slider':
        req.body['action.results'] = [
          { value: '-100', percentage: 0, votes: 0 },
          { value: '-75', percentage: 0, votes: 0 },
          { value: '-50', percentage: 0, votes: 0 },
          { value: '-25', percentage: 0, votes: 0 },
          { value: '0', percentage: 0, votes: 0 },
          { value: '25', percentage: 0, votes: 0 },
          { value: '50', percentage: 0, votes: 0 },
          { value: '75', percentage: 0, votes: 0 },
          { value: '100', percentage: 0, votes: 0 }
        ]
        break
      default:
        req.body['action.results'] = []
    }
  }

  const attrs = filter(req.body, (v, k) => updatable.includes(k))

  req.forum.topicsAttrs.forEach((attr) => {
    const key = `attrs.${attr.name}`

    if (!attrs.hasOwnProperty(key)) return

    if (attr.kind === 'Number') {
      attrs[key] = parseInt(attrs[key], 10) || attr.min
      if (attrs[key] < attr.min || attrs[key] > attr.max) {
        attrs[key] = undefined
      }
    } else if (attr.kind === 'String') {
      attrs[key] = String(attrs[key])
      if (attrs[key].length < attr.min || attrs[key].length > attr.max) {
        attrs[key] = undefined
      }
    } else if (attr.kind === 'Enum') {
      const selected = attr.options.find((opt) => opt.name === attrs[key])
      if (!selected) attrs[key] = undefined
    } else if (attr.kind === 'Boolean') {
      if (!attrs[key] || attrs[key] === 'false' || attrs[key] === 'off') {
        attrs[key] = undefined
      } else {
        attrs[key] = true
      }
    }
  })

  req.keysToUpdate = attrs

  next()
}

exports.autoPublish = function autoPublish (req, res, next) {
  // Auto publish topic for common user proposal
  if (!forumPrivileges.canChangeTopics(req.forum, req.user)) {
    req.keysToUpdate.publishedAt = new Date()
  }

  next()
}

const ObjectID = require('mongoose').Types.ObjectId
const Topic = require('lib/models').Topic
const Vote = require('lib/models').Vote
const Comments = require('../comments')
const scopes = require('./scopes')
const removeOwnVote = require('./utils').removeOwnVote
const votedBy = require('./utils').votedBy
const calcResult = require('./utils').calcResult

/**
 * Default find Method, to be used in favor of Model.find()
 * @method find
 * @param  {object} query - mongoose query options
 * @return {Mongoose Query}
 */
function find (query) {
  return Topic.find(Object.assign({
    deletedAt: null
  }, query))
}

exports.find = find

/**
 * Get the public listing of topics from a forum
 * @method list
 * @param  {object} opts
 * @param  {document} opts.forum - Topic Forum
 * @param  {boolean} opts.draft - if draft topics should be added
 * @param  {number} opts.limit - Amount of results per page
 * @param  {number} opts.page - Page number
 * @param  {document} opts.user - User data is beign fetched for
 * @param  {('score'|'-score'|'createdAt'|'-createdAt')} opts.sort
 * @return {promise}
 */
exports.list = function list (opts) {
  opts = opts || {}

  const forum = opts.forum
  const user = opts.user

  const query = { forum: forum._id }

  if (opts.tag) query.tags = { $in: [opts.tag] }

  if (!opts.draft) query.publishedAt = { $ne: null }

  return find()
    .where(query)
    .populate(scopes.ordinary.populate)
    .select(scopes.ordinary.select)
    .limit(opts.limit)
    .skip((opts.page - 1) * opts.limit)
    .sort(opts.sort)
    .exec()
    .then((topics) => Promise.all(topics.map((topic) => {
      return scopes.ordinary.expose(topic, forum, user)
    })))
    .then((topics) => Promise.all(topics.map((topic) => {
      return Comments.commentersCount({ topicId: topic.id })
        .then((commentersCount) => {
          topic.commentersCount = commentersCount
          return topic
        })
    })))
}

/**
 * Get the count of total topics
 * @method listCount
 * @param  {objectId} forumId
 * @return {promise}
 */
exports.listCount = function listCount (forumId) {
  return find()
    .where({ forum: forumId })
    .count()
    .exec()
}

/**
 * Get topic
 *
 * @param {String} opts.id Topic `id`
 * @param {User} opts.user current user
 * @param {Forum} opts.forum Topic Forum
 * @return {promise}
 * @api public
 */

exports.get = function get (opts, attrs) {
  const id = opts.id
  const user = opts.user
  const forum = opts.forum

  return find()
    .findOne()
    .where({ _id: id })
    .select(scopes.ordinary.select)
    .populate(scopes.ordinary.populate)
    .exec()
    .then((topic) => scopes.ordinary.expose(topic, forum, user))
}

/**
 * Create topic
 *
 * @param {User} opts.user editor of the topic
 * @param {Forum} opts.forum Forum
 * @param {Object} attrs attributes of the Topic
 * @return {promise}
 * @api public
 */

exports.create = function create (opts, attrs) {
  const user = opts.user
  const forum = opts.forum

  attrs.forum = forum._id
  attrs.owner = user._id

  switch (attrs['action.method']) {
    case 'vote':
      attrs['action.results'] = [
        { value: 'positive', percentage: 0, votes: 0 },
        { value: 'neutral', percentage: 0, votes: 0 },
        { value: 'negative', percentage: 0, votes: 0 }
      ]
      break
    case 'poll':
    case 'hierarchy':
      if (!attrs['action.options']) {
        return Promise.reject("Can't create a poll without options")
      }
      attrs['action.results'] = attrs['action.options'].map((o) => ({ value: o, percentage: 0, votes: 0 }))
      delete attrs['action.options']
      break
    case 'cause':
      attrs['action.results'] = [{ value: 'support', percentage: 0, votes: 0 }]
      break
    case 'slider':
      attrs['action.results'] = [
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
      attrs['action.results'] = []
  }

  const topic = new Topic()

  updateClauses(attrs, topic)
  setAttributes(attrs, topic)

  return topic.save()
    .then((topic) => scopes.ordinary.expose(topic, forum, user))
}

/**
 * Edit topic
 *
 * @param {String} opts.id Topic `id`
 * @param {User} opts.user editor of the topic
 * @param {Forum} opts.forum Forum
 * @param {Object} attrs attributes to be updated
 * @return {promise}
 * @api public
 */

exports.edit = function edit (opts, attrs) {
  const id = opts.id
  const user = opts.user
  const forum = opts.forum

  return find()
    .findOne()
    .where({ _id: id })
    .select(scopes.ordinary.select)
    .populate(scopes.ordinary.populate)
    .exec()
    .then(updateClauses.bind(null, attrs))
    .then(setAttributes.bind(null, attrs))
    .then((topic) => topic.save())
    .then((topic) => scopes.ordinary.expose(topic, forum, user))
}

/**
 * Publish topic
 *
 * @param {String} opts.id Topic `id`
 * @param {User} opts.user editor of the topic
 * @param {Forum} opts.forum Forum
 * @return {promise}
 * @api public
 */

exports.publish = function publish (opts) {
  const id = opts.id
  const user = opts.user
  const forum = opts.forum

  return find()
    .findOne()
    .where({ _id: id })
    .select(scopes.ordinary.select)
    .populate(scopes.ordinary.populate)
    .exec()
    .then((topic) => {
      topic.publishedAt = new Date()
      return topic.save()
    })
    .then((topic) => scopes.ordinary.expose(topic, forum, user))
}

/**
 * Unpublish topic
 *
 * @param {String} opts.id Topic `id`
 * @param {User} opts.user editor of the topic
 * @param {Forum} opts.forum Forum
 * @return {promise}
 * @api public
 */

exports.unpublish = function unpublish (opts) {
  const id = opts.id
  const user = opts.user
  const forum = opts.forum

  return find()
    .findOne()
    .where({ _id: id })
    .select(scopes.ordinary.select)
    .populate(scopes.ordinary.populate)
    .exec()
    .then((topic) => {
      topic.publishedAt = null
      return topic.save()
    })
    .then((topic) => scopes.ordinary.expose(topic, forum, user))
}

/**
 * Delete topic
 *
 * @param {String} opts.id Topic `id`
 * @return {promise}
 * @api public
 */

exports.destroy = function destroy (opts) {
  const id = opts.id

  return find()
    .findOne()
    .where({ _id: id })
    .select(scopes.ordinary.select)
    .populate(scopes.ordinary.populate)
    .exec()
    .then(setAttributes.bind(null, { deletedAt: new Date() }))
    .then((topic) => topic.save())
}

/**
 * Vote topic
 *
 * @param {String} opts.id Topic `id`
 * @param {User} opts.user author of the vote
 * @param {Forum} opts.forum author of the vote
 * @param {String} opts.value `positive` or `negative` or `neutral`
 * @return {promise}
 * @api public
 */

exports.vote = function vote (opts) {
  const { id, user, forum, value } = opts

  return find()
    .findOne()
    .where({ _id: id })
    .select(scopes.ordinary.select)
    .populate(scopes.ordinary.populate)
    .exec()
    .then(doVote.bind(null, user, value))
    .then((topic) => scopes.ordinary.expose(topic, forum, user))
}

/**
 * Vote Topic with provided user
 * and voting value
 *
 * @param {User|ObjectId|String} user
 * @param {String} value
 * @param {Function} cb
 * @api public
 */

function doVote (user, value, topic) {
  if (topic.status === 'closed') {
    const err = new Error('Voting on this topic os closed.')
    err.code = 'VOTING_CLOSED'
    return Promise.reject(err)
  }

  return votedBy(user, topic)
    .then((voted) => {
      if (voted) {
        return Promise.all([voted, removeOwnVote(user, topic)])
      }
      return Promise.resolve(voted)
    })
    .then((results) => {
      if (results[1] && ['cause'].indexOf(topic.action.method) !== -1) {
        return Promise.resolve()
      }

      const vote = new Vote({
        author: user.id,
        value: value,
        topic: topic.id
      })

      return vote.save()
    })
    .then(() => calcResult(topic))
    .then((results) => {
      topic.action.results = results.results
      topic.action.count = results.count
      return topic.save()
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}

/**
 * Get tags from topics
 *
 * @method getTags
 * @param  {object} opts
 * @param  {document} opts.forum - Topic Forum
 * @param  {number} opts.limit - Amount of results per page
 * @param  {number} opts.page - Page number
 * @param  {('count'|'-count'|'tag'|'-tag')} opts.sort
 * @return {promise}
 * @api public
 */

exports.getTags = function getTags (opts) {
  const forum = new ObjectID(opts.forum._id)
  let sort = { 'count': -1 }
  if (opts.sort) {
    switch (opts.sort) {
      case 'count':
        sort = { 'count': 1 }
        break
      case '-count':
        sort = { 'count': -1 }
        break
      case 'tag':
        sort = { '_id': 1 }
        break
      case '-tag':
        sort = { '_id': -1 }
        break
    }
  }

  let limit = 100
  if (opts.limit && opts.limit < 1000) limit = opts.limit

  let page = 1
  if (opts.page) page = opts.page

  const skip = (page - 1) * limit

  return new Promise((resolve, reject) => {
    Topic.aggregate([
      { $match: { forum, deletedAt: null } },
      { $unwind: '$tags' },
      {
        $group: {
          '_id': '$tags',
          'count': { '$sum': 1 }
        }
      },
      { $sort: sort },
      {
        $group: {
          _id: null,
          count: { '$sum': 1 },
          results: { $push: '$$ROOT' }
        }
      },
      {
        $project: {
          tags: {
            $slice: ['$results', skip, limit]
          },
          count: '$count'
        }
      }
    ], function (err, results) {
      if (err) return reject(err)
      if (results.length === 0) {
        return resolve({
          tags: [],
          pagination: {
            total: 0,
            page,
            limit
          }
        })
      }
      const [{ tags, count }] = results
      resolve({
        tags: tags.map(({ _id, count }) => ({ text: _id, count })),
        pagination: {
          total: count,
          page: page,
          limit
        }
      })
    })
  })
}

/**
 * Update tags from topics
 *
 * @method updateTags
 * @param  {object} opts
 * @param  {document} opts.forum - Topic Forum
 * @param  {string} opts.oldTags - Tags to find
 * @param  {string} opts.newTags - Tags to replace
 * @return {promise}
 * @api public
 */

exports.updateTags = function updateTags (opts) {
  const forum = new ObjectID(opts.forum._id)
  let { oldTags, newTags } = opts

  oldTags = oldTags.split(',').filter((t) => t)
  newTags = newTags.split(',').filter((t) => t)

  if (oldTags.length === 0) return Promise.resolve()

  return Promise.resolve()
    .then(() => Topic.collection.find({ forum }).toArray())
    .then(mapPromises(function (topic) {
      if (topic.tags && topic.tags.some((tag) => oldTags.some((oldTag) => oldTag === tag))) {
        let newTopicTags = topic.tags.filter((tag) => !oldTags.includes(tag))

        if (newTags.length > 0) {
          newTopicTags = newTopicTags.concat(newTags)
        }
        newTopicTags = newTopicTags.filter((t, i, a) => a.includes(t))

        return Topic.collection
          .findOneAndUpdate({ _id: topic._id }, { $set: { tags: newTopicTags } })
      } else {
        return Promise.resolve()
      }
    }))
}

/**
 * map array to promises helper
 */

const mapPromises = (fn) => (array) => Promise.all(array.map(fn))

/**
 * Sorting function for topic clauses
 */

function byPosition (a, b) {
  return a.position - b.position
}

/**
 * Set attributes on a model, don't allow set of entire object.
 */

function setAttributes (attrs, model) {
  Object.keys(attrs).forEach((key) => {
    model.set(key, attrs[key])
  })

  return model
}

/**
 * Update the clauses of a Topic from an attrs object
 */

function updateClauses (attrs, topic) {
  const clauses = attrs.clauses
  delete attrs.clauses

  if (!clauses || !clauses.length) return topic

  const submitted = clauses.map((c) => c.id)
  const persisted = topic.clauses.map((c) => c.id)
  const toDelete = persisted.filter((i) => !~submitted.indexOf(i))

  // Delete non submitted clauses
  toDelete.forEach((id) => { topic.clauses.pull({ _id: id }) })

  // Add new clauses or update existing
  clauses.forEach(function (clause) {
    if (clause.id) {
      var c = topic.clauses.id(clause.id)
      if (c) c.set(clause)
    } else {
      topic.clauses.addToSet(clause)
    }
  })

  topic.clauses = topic.clauses.sort(byPosition)

  return topic
}

const ObjectId = require('mongoose').Types.ObjectId
const debug = require('debug')
const utils = require('lib/utils')
const Topic = require('lib/models').Topic

const log = debug('democracyos:db-api:topic')
const pluck = utils.pluck

/**
 * Get all topics
 *
 * @param {Function} fn callback function
 *   - 'err' error found on query or `null`
 *   - 'topics' list items found or `undefined`
 * @return {Module} `topic` module
 * @api public
 */

exports.all = function all (params, fn) {
  log('Looking for all topics.')

  var query = { deletedAt: null }

  if (params.forum) query.forum = params.forum

  Topic
    .find(query)
    .select('id topicId mediaTitle tag tags participants votes createdAt updatedAt closingAt publishedAt deletedAt status open closed links author authorUrl forum coverUrl extra action')
    .populate('tag', 'id hash name color image')
    .exec(function (err, topics) {
      if (err) {
        log('Found error %j', err)
        return fn(err)
      }

      log('Delivering topics %j', pluck(topics, 'id'))
      fn(null, topics)
    })

  return this
}

/**
 * Search topics from query
 *
 * @param {Object} query filter
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'topics' list of topics objects found or `undefined`
 * @return {Module} `topic` module
 * @api public
 */

exports.search = function search (query, fn) {
  log('Searching for topics matching %j', query)

  Topic
    .find(query, function (err, topics) {
      if (err) {
        log('Found error: %j', err)
        return fn(err)
      }

      log('Found topics %j for %j', pluck(topics, 'id'), query)
      fn(null, topics)
    })

  return this
}

/**
 * Search single topic from _id
 *
 * @param {ObjectId} topic Id to search by `_id`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'topic' single topic object found or `undefined`
 * @return {Module} `topic` module
 * @api public
 */

exports.searchOne = function searchOne (id, fn) {
  var query = { _id: id, deletedAt: null }

  log('Searching for single topic matching %j', query)
  Topic
    .findOne(query)
    .populate('tag participants')
    .exec(function (err, topic) {
      if (err) {
        log('Found error %s', err)
        return fn(err)
      }

      if (!topic) {
        log('Topic with id %s not found.', id)
        return fn(new Error('Topic not found'))
      }

      log('Delivering topic %s', topic.id)

      fn(null, topic)
    })

  return this
}

/**
 * Get Topic form `id` string or `ObjectId`
 *
 * @param {String|ObjectId} id Topic's `id`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'topic' found item or `undefined`
 * @api public
 */

function onget (fn) {
  return function (err, topic) {
    if (err) {
      log('Found error %s', err)
      return fn(err)
    }

    if (!topic) {
      log('Topic not found')
      return fn(null)
    }

    topic.clauses = topic.clauses.sort(byPosition)
    log('Delivering topic %s', topic.id)
    fn(null, topic)
  }
}

exports.get = function get (id, fn) {
  if (!ObjectId.isValid(id)) {
    log('ObjectId %s is not valid', id)
    return fn(null)
  }

  var query = { _id: id, deletedAt: null }

  log('Looking for topic %s', id)
  Topic
    .findOne(query)
    .populate('tag')
    .exec(onget(fn))
}

exports.getWithForum = function getWithForum (id, fn) {
  if (!ObjectId.isValid(id)) {
    log('ObjectId %s is not valid', id)
    return fn(null)
  }

  var query = { _id: id, deletedAt: null }

  log('Looking for topic %s', id)
  Topic
    .findOne(query)
    .populate('tag forum')
    .exec(onget(fn))
}

/**
 * Vote topic
 *
 * @param {String} id Topic `id`
 * @param {String} user author of the vote
 * @param {String} value `positive` or `negative` or `neutral`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'proposal' single object created or `undefined`
 * @api public
 */

exports.vote = function vote (id, user, value, fn) {
  var query = { _id: id, deletedAt: null }

  log('Proceding to vote %s at topic %s by user %s', value, id, user.id || user)

  Topic
    .findOne(query)
    .populate('tag', 'id hash name color image')
    .exec(function (err, topic) {
      if (err) {
        log('Found error %s', err)
        return fn(err)
      }

      doVote(topic, user, value, fn)
    })
}

function doVote (topic, user, value, cb) {
  topic.vote(user.id, value, function (err) {
    if (err) {
      log('Found error %s', err)
      return cb(err)
    }

    log('Voted %s at topic %s by user %s', value, topic.id, user.id || user)
    cb(null, topic)
  })
}

/**
 * Search total votes
 *
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'votes', total casted or `undefined`
 * @return {Module} `topic` module
 * @api public
 */

exports.votes = function votes (fn) {
  log('Counting total casted votes')

  Topic
    .aggregate(
      { $unwind: '$votes' },
      { $group: { _id: '#votes', total: { $sum: 1 } } },
      function (err, res) {
        if (err) {
          log('Found error: %j', err)
          return fn(err)
        }

        if (!res[0]) return fn(null, 0)

        var total = res[0].total

        log('Found %d casted votes', total)
        fn(null, total)
      }
  )

  return this
}

/**
 * Sorting function for topic clauses
 */

function byPosition (a, b) {
  return a.position - b.position
}

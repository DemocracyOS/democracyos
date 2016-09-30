/**
 * Extend module's NODE_PATH
 * HACK: temporary solution
 */

require('node-path')(module)

/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var Topic = mongoose.model('Topic')
var commentApi = require('./comment')
var tagApi = require('./tag')
var utils = require('lib/utils')
var log = require('debug')('democracyos:db-api:topic')
var pluck = utils.pluck

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
    .select('id topicId mediaTitle tag participants votes createdAt updatedAt closingAt publishedAt deletedAt status open closed links author authorUrl forum coverUrl')
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
 * Creates topic
 *
 * @param {Object} data to create topic
 * @param {Function} fn callback function
 *   - 'err' error found on query or `null`
 *   - 'topic' item created or `undefined`
 * @return {Module} `topic` module
 * @api public
 */

exports.create = function create (data, fn) {
  log('Creating new topic %j', data)

  ensureTag(data, function (err, topic) {
    if (err) {
      log('Found error from topic creation: %s', err.message)
      return fn(err)
    }
    createTopic(topic, fn)
  })

  return this
}

function ensureTag (data, fn) {
  tagApi.searchOne(data.hash, function (err, tags) {
    if (err) {
      log('Found error %s', err.message)
      return fn(err)
    }

    if (!tags.length) {
      if (!data.tag) return fn(new Error('No tag provided'))
      tagApi.create(data.tag, afterCreate)
    } else {
      fn(null, data)
    }
  })

  function afterCreate (err, tag) {
    if (err) {
      log('Found error from tag creation: %s', err.message)
      return fn(err)
    }
    data.tag = tag
    fn(null, data)
  }
}

function createTopic (data, fn) {
  var topic = new Topic(data)
  topic.save(onsave)

  function onsave (err) {
    if (err) return fn(err)
    log('Saved topic %s', topic.id)
    fn(null, topic)
  }
}

/**
 * Update topic by `id` and `data`
 *
 * @param {ObjectId|String} data to create topic
 * @param {Function} fn callback function
 *   - 'err' error found on query or `null`
 *   - 'topic' item created or `undefined`
 * @return {Module} `topic` module
 * @api public
 */

exports.update = function update (id, data, fn) {
  log('Updating topic %s with %j', id, data)

  // look for tag for nesting reference
  log('Looking for tag %s in database.', data.tag)

  tagApi.searchOne(data.tag, function (err, tag) {
    if (err) {
      log('Found error %s', err.message)
      return fn(err)
    }

    // now set `data.tag` to `tag`'s document _id
    data.tag = tag

    // get topic
    exports.get(id, onget)
  })

  function onget (err, topic) {
    if (err) {
      log('Found error %s', err.message)
      return fn(err)
    }

    var clauses = data.clauses || []
    delete data.clauses

    // Delete non submitted clauses
    var submittedIds = clauses.map(function (c) { return c.id })
    var persistedIds = topic.clauses.map(function (c) { return c.id })
    var clausesToDelete = persistedIds.filter(function (i) { return !~submittedIds.indexOf(i) })
    log('submittedIds: %j', submittedIds)
    log('persistedIds: %j', persistedIds)
    log('clausesToDelete: %j', clausesToDelete)
    clausesToDelete.forEach(function (id) { topic.clauses.pull({ _id: id }) })

    // Add new clauses or update existing
    clauses.forEach(function (clause) {
      log('clause: %j', clause)
      if (clause.id) {
        var c = topic.clauses.id(clause.id)
        c.set(clause)
      } else {
        topic.clauses.addToSet(clause)
      }
    })

    var links = data.links || []
    delete data.links

    links.forEach(function (link) {
      var l = topic.links.id(link.id)
      l.set(link)
    })

    // update and save topic document with data
    topic.set(data)
    topic.save(onupdate)
  }

  function onupdate (err, topic) {
    if (err) {
      log('Found error %s', err)
      return fn(err)
    }
    log('Saved topic %s', topic.id)

    topic.clauses = topic.clauses.sort(byPosition)
    return fn(null, topic)
  }

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
    .populate('tag')
    .populate('participants')
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
  if (!mongoose.Types.ObjectId.isValid(id)) {
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
  if (!mongoose.Types.ObjectId.isValid(id)) {
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
 * Direct comment to topic
 *
 * @param {String} id Proposal's `id`
 * @param {Object} comment to attach
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'topic' single object created or `undefined`
 * @api public
 */

exports.comment = function comment (item, fn) {
  log('Creating comment %j for topic %s', item.text, item.reference)
  commentApi.create(item, function (err, commentDoc) {
    if (err) {
      log('Found error %j', err)
      return fn(err)
    }

    log('Delivering comment %j', commentDoc)
    fn(null, commentDoc)
  })
}

/**
 * Get comments for topic
 *
 * @param {String} id Topic's `id`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'topic' single object created or `undefined`
 * @api public
 */

exports.comments = function comments (id, paging, fn) {
  log('Get comments for topic %s', id)

  var query = {
    $or: [
      { context: 'topic', reference: id },
      { context: 'topic', reference: mongoose.Types.ObjectId(id) }
    ]
  }

  if (paging.exclude_user) {
    query.author = { $ne: paging.exclude_user }
  }

  commentApi.getFor(query, paging, function (err, items) {
    if (err) {
      log('Found error %j', err)
      return fn(err)
    }

    log('Delivering comments %j', pluck(items, 'id'))
    fn(null, items)
  })
}

/**
 * Get comments for topic
 *
 * @param {String} id Topic's `id`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'topic' single object created or `undefined`
 * @api public
 */

exports.userComments = function userComments (id, userId, fn) {
  log('Get comments for topic %s from user %s', id, userId)

  var query = {
    context: 'topic',
    $or: [
      { context: 'topic', reference: id },
      { context: 'topic', reference: mongoose.Types.ObjectId(id) }
    ],
    author: userId
  }

  var paging = { limit: 0, sort: 'createdAt' }

  commentApi.getFor(query, paging, function (err, comments) {
    if (err) {
      log('Found error %j', err)
      return fn(err)
    }

    log('Delivering comments %j from user %s', pluck(comments, 'id'), userId)
    fn(null, comments)
  })
}

/**
 * Get topics for RSS
 *
 * @param {Function} fn callback function
 *   - 'err' error found on query or `null`
 *   - 'topics' list items found or `undefined`
 * @return {Module} `topic` module
 * @api public
 */

exports.rss = function all (fn) {
  log('Looking for RSS topics.')

  Topic
    .find({ deletedAt: null })
    .select('id topicId mediaTitle publishedAt body')
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

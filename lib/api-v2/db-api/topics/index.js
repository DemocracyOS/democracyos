const Topic = require('lib/models').Topic
const scopes = require('./scopes')

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
 * Edit topic
 *
 * @param {String} id Topic `id`
 * @param {String} user editor of the topic
 * @param {String} forum Forum `id`
 * @param {Object} attrs attributes to be updated
 * @return {promise}
 * @api public
 */

exports.edit = (function () {
  return function edit (opts, attrs) {
    const id = opts.id
    const user = opts.user
    const forum = opts.forum

    return find()
      .findOne()
      .where({ _id: id })
      .populate(scopes.ordinary.populate)
      .exec()
      .then(updateClauses.bind(null, attrs))
      .then((topic) => {
        Object.keys(attrs).forEach((key) => {
          topic.set(key, attrs[key])
        })

        return topic.save()
      })
      .then((topic) => scopes.ordinary.expose(topic, forum, user))
  }

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
})()

/**
 * Vote topic
 *
 * @param {String} id Topic `id`
 * @param {String} user author of the vote
 * @param {String} value `positive` or `negative` or `neutral`
 * @return {promise}
 * @api public
 */

exports.vote = function vote (opts) {
  opts = opts || {}

  return find()
    .findOne()
    .where({ _id: opts.id })
    .populate('tag', 'id hash name color image')
    .populate('participants')
    .exec()
    .then(doVote.bind(null, opts.user, opts.value))
    .then((topic) => scopes.ordinary.expose(topic, opts.forum, opts.user))
}

function doVote (user, value, topic) {
  return new Promise((resolve, reject) => {
    topic.vote(user, value, function (err, topic) {
      if (err) return reject(err)
      resolve(topic)
    })
  })
}

/**
 * Poll topic
 *
 * @param {String} id Topic `id`
 * @param {String} user author of the vote
 * @param {String} value one of action.pollOptions
 * @return {promise}
 * @api public
 */

exports.poll = function poll (opts) {
  return find()
    .findOne()
    .where({ _id: opts.id })
    .populate('tag', 'id hash name color image')
    .populate('participants')
    .exec()
    .then(doPoll.bind(null, opts.user, opts.value))
    .then((topic) => scopes.ordinary.expose(topic, opts.forum, opts.user))
}

function doPoll (user, value, topic) {
  return new Promise((resolve, reject) => {
    if (!~topic.action.pollOptions.indexOf(value)) {
      return reject(new Error('Invalid value for poll'))
    }

    topic.poll(user, value, function (err, topic) {
      if (err) return reject(err)
      resolve(topic)
    })
  })
}


/**
 * Sorting function for topic clauses
 */

function byPosition (a, b) {
  return a.position - b.position
}

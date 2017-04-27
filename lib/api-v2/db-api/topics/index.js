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
  const id = opts.id
  const user = opts.user
  const forum = opts.forum
  const value = opts.value

  return find()
    .findOne()
    .where({ _id: id })
    .select(scopes.ordinary.select)
    .populate(scopes.ordinary.populate)
    .exec()
    .then(doVote.bind(null, user, value))
    .then((topic) => scopes.ordinary.expose(topic, forum, user))
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
 * @param {String} opts.id Topic `id`
 * @param {User} opts.user author of the vote
 * @param {Forum} opts.forum author of the vote
 * @param {String} opts.value One of Topic.action.pollOptions
 * @return {promise}
 * @api public
 */

exports.poll = function poll (opts) {
  const id = opts.id
  const user = opts.user
  const forum = opts.forum
  const value = opts.value

  return find()
    .findOne()
    .where({ _id: id })
    .select(scopes.ordinary.select)
    .populate(scopes.ordinary.populate)
    .exec()
    .then(doPoll.bind(null, user, value))
    .then((topic) => scopes.ordinary.expose(topic, forum, user))
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

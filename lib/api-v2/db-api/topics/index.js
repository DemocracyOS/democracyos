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
    .then((topic) => scopes.ordinary.expose(topic, opts.user))
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

const Topic = require('lib/models').Topic

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
  return find()
    .findOne()
    .where({ _id: opts.id })
    .populate('tag', 'id hash name color image')
    .exec()
    .then(doVote.bind(null, opts.user, opts.value))
}

function doVote (user, value, topic) {
  return new Promise((resolve, reject) => {
    topic.vote(user, value, function (err, topic) {
      if (err) return reject(err)
      resolve(topic)
    })
  })
}

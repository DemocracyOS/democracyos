var Comment = require('lib/models').Comment
var scopes = require('./scopes')

/**
 * Default find Method, to be used in favor of Model.find()
 * @method find
 * @param  {object} query - Mongoose query options
 * @return {Mongoose Query}
 */
function find (query) {
  return Comment.find(Object.assign({
    context: 'topic'
  }, query))
}

exports.find = find

/**
 * Get the public listing of comments from a topic
 * @method list
 * @param  {object} opts
 * @param  {objectId} opts.topicId
 * @param  {number} opts.limit - Amount of results per page
 * @param  {number} opts.page - Page number
 * @param  {document} opts.user - User data is beign fetched for
 * @param  {('score'|'-score'|'createdAt'|'-createdAt')} opts.sort
 * @return {promise}
 */
exports.list = function list (opts) {
  opts = opts || {}

  return find()
    .where({reference: opts.topicId})
    .populate(scopes.ordinary.populate)
    .select(scopes.ordinary.select)
    .limit(opts.limit)
    .skip((opts.page - 1) * opts.limit)
    .sort(opts.sort)
    .exec()
    .then((comments) => comments.map((comment) => {
      return scopes.ordinary.expose(comment, opts.user)
    }))
}

/**
 * Get the count of total comments of the public listing
 * @method listCount
 * @param  {object} opts
 * @param  {objectId} opts.topicId
 * @return {promise}
 */
exports.listCount = function listCount (opts) {
  opts = opts || {}

  return find()
    .where({reference: opts.topicId})
    .count()
    .exec()
}

/**
 * Make a user vote a comment
 * @method vote
 * @param  {object} opts
 * @param {string} opts.id - Comment Id
 * @param {document} opts.user - Author of the vote
 * @param {('positive'|'negative')} opts.type - Vote type
 * @return {promise}
 */
exports.vote = function vote (opts) {
  const id = opts.id
  const user = opts.user
  const type = opts.type

  return find()
    .findOne()
    .where({_id: id})
    .populate(scopes.ordinary.populate)
    .select(scopes.ordinary.select)
    .exec()
    .then(verifyAutovote.bind(null, user))
    .then(doVote.bind(null, user, type))
    .then((comment) => scopes.ordinary.expose(comment, user))
}

function verifyAutovote (user, comment) {
  if (comment.author.equals(user._id)) {
    const err = new Error('A user can\'t vote his own comment.')
    err.code = 'NO_AUTOVOTE'
    throw err
  }
  return comment
}

function doVote (user, type, comment) {
  return new Promise((resolve, reject) => {
    comment.vote(user, type, function (err) {
      if (err) return reject(err)
      resolve(comment)
    })
  })
}

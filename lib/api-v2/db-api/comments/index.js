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
 * Create or Update a vote on a comment
 * @method vote
 * @param  {object} opts
 * @param {string} opts.id - Comment Id
 * @param {document} opts.user - Author of the vote
 * @param {('positive'|'negative')} opts.value - Vote value
 * @return {promise}
 */
exports.vote = function vote (opts) {
  const id = opts.id
  const user = opts.user
  const value = opts.value

  return find()
    .findOne()
    .where({_id: id})
    .populate(scopes.ordinary.populate)
    .select(scopes.ordinary.select)
    .exec()
    .then(verifyAutovote.bind(null, user))
    .then(doVote.bind(null, user, value))
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

function doVote (user, value, comment) {
  return new Promise((resolve, reject) => {
    comment.vote(user, value, function (err) {
      if (err) return reject(err)
      resolve(comment)
    })
  })
}

/**
 * Create or Update a vote on a comment
 * @method vote
 * @param  {object} opts
 * @param {string} opts.id - Comment Id
 * @param {document} opts.user - Author of the vote
 * @param {('positive'|'negative')} opts.value - Vote value
 * @return {promise}
 */
exports.unvote = function unvote (opts) {
  const id = opts.id
  const user = opts.user

  return find()
    .findOne()
    .where({_id: id})
    .populate(scopes.ordinary.populate)
    .select(scopes.ordinary.select)
    .exec()
    .then(doUnvote.bind(null, user))
    .then((comment) => scopes.ordinary.expose(comment, user))
}

function doUnvote (user, comment) {
  return new Promise((resolve, reject) => {
    comment.unvote(user, function (err) {
      if (err) return reject(err)
      resolve(comment)
    })
  })
}

/**
 * Create a comment
 * @method vote
 * @param  {object} opts
 * @param {string} opts.text - Comment text
 * @param {document} opts.user - Author of the comment
 * @param {document} opts.topicId - Topic where the comment is beign created
 * @return {promise}
 */
exports.create = function create (opts) {
  const text = opts.text
  const user = opts.user
  const topicId = opts.topicId

  return Comment
    .create({
      text: text,
      context: 'topic',
      reference: topicId,
      author: user
    })
    .then((comment) => scopes.ordinary.expose(comment, user))
}

/**
 * Create a reply
 * @method reply
 * @param  {object} opts
 * @param {string} opts.text - Reply text
 * @param {document} opts.user - Author of the comment
 * @param {document} opts.id - Comment id
 * @return {promise}
 */
exports.reply = function reply (opts) {
  const text = opts.text
  const user = opts.user
  const id = opts.id

  return find()
    .findOne()
    .where({_id: id})
    .populate(scopes.ordinary.populate)
    .select(scopes.ordinary.select)
    .exec()
    .then(doReply.bind(null, user, text))
    .then((comment) => scopes.ordinary.expose(comment, user))
}

function doReply (user, text, comment) {
  return new Promise((resolve, reject) => {
    const reply = comment.replies.create({
      text: text,
      author: user
    })
    comment.replies.push(reply)
    comment.save((err, commentSaved) => {
      if (err) reject(err)
      resolve(commentSaved)
    })
  })
}

/**
 * Delete comment
 * @method delete
 * @param  {object} opts
 * @param {document} opts.user - Author of the comment
 * @param {document} opts.id - Comment id
 * @return {promise}
 */
exports.removeComment = function remove (opts) {
  const id = opts.id

  return find()
    .findOne()
    .populate(scopes.ordinary.populate)
    .select(scopes.ordinary.select)
    .where({_id: id})
    .exec()
    .then((comment) => {
      if (comment.author.id !== opts.user.id && !opts.user.staff) {
        return Promise.reject({
          status: 403,
          code: 'NOT_YOURS'
        })
      }

      if (comment.replies.length > 0 && !opts.user.staff) {
        return Promise.reject({
          status: 403,
          code: 'HAS_REPLIES'
        })
      }

      return Promise.resolve(comment)
    })
    .then(doRemoveComment)
}

function doRemoveComment (comment) {
  return new Promise((resolve, reject) => {
    comment.remove((err) => {
      if (err) reject(err)
      resolve()
    })
  })
}

/**
 * Delete comment reply
 * @method delete
 * @param  {object} opts
 * @param {document} opts.user - Author of the comment
 * @param {document} opts.id - Comment id
 * @param {document} opts.replyId - Reply id
 * @return {promise}
 */
exports.removeReply = function remove (opts) {
  const id = opts.id

  return find()
    .findOne()
    .populate(scopes.ordinary.populate)
    .select(scopes.ordinary.select)
    .where({_id: id})
    .exec()
    .then((comment) => {
      var reply = comment.replies.id(opts.replyId)
      if (reply.author !== opts.user.id && !opts.user.staff) {
        return Promise.reject({
          status: 403,
          code: 'NOT_YOURS'
        })
      }
      return Promise.resolve(comment, opts.replyId)
    })
    .then(doRemoveReply)
}

function doRemoveReply (comment, replyId) {
  return new Promise((resolve, reject) => {
    comment.replies.id(replyId).remove()
    comment.save(function (err, _comment) {
      if (err) reject(err)
      resolve(_comment)
    })
  })
}

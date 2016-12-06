var Comment = require('lib/models').Comment
var privileges = require('lib/models/forum/privileges')
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
    err.status = 400
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
exports.removeComment = (function () {
  function verifyPrivileges (forum, user, comment) {
    if (privileges.canEdit(forum, user)) return comment

    if (!comment.author.equals(user._id)) {
      const err = new Error('Can\'t delete comments from other users')
      err.code = 'NOT_YOURS'
      err.status = 400
      throw err
    }

    return comment
  }

  function verifyNoReplies (user, comment) {
    if (comment.replies.length > 0 && !user.staff) {
      const err = new Error('Can\'t delete comments with replies')
      err.code = 'HAS_REPLIES'
      err.status = 400
      throw err
    }
    return comment
  }

  function doRemoveComment (comment) {
    return new Promise((resolve, reject) => {
      comment.remove((err) => {
        if (err) reject(err)
        resolve()
      })
    })
  }

  return function removeComment (opts) {
    const id = opts.id
    const forum = opts.forum
    const user = opts.user

    return find()
      .findOne()
      .where({_id: id})
      .populate(scopes.ordinary.populate)
      .select(scopes.ordinary.select)
      .exec()
      .then(verifyPrivileges.bind(null, forum, user))
      .then(verifyNoReplies.bind(null, user))
      .then(doRemoveComment)
  }
})()

/**
 * Delete comment reply
 * @method delete
 * @param  {object} opts
 * @param {document} opts.user - Author of the comment
 * @param {document} opts.id - Comment id
 * @param {document} opts.replyId - Reply id
 * @return {promise}
 */
exports.removeReply = (function () {
  function verifyPrivileges (forum, user, replyId, comment) {
    const reply = comment.replies.id(replyId)

    if (privileges.canEdit(forum, user)) return comment

    if (reply.author.id !== user.id && !user.staff) {
      const err = new Error('Can\'t delete replies from other users')
      err.code = 'NOT_YOURS'
      err.status = 400
      throw err
    }

    return comment
  }

  function doRemoveReply (user, replyId, comment) {
    const reply = comment.replies.id(replyId)

    return new Promise((resolve, reject) => {
      reply.remove()
      comment.save(function (err, _comment) {
        if (err) reject(err)
        resolve(_comment)
      })
    })
  }

  return function removeReply (opts) {
    const id = opts.id
    const user = opts.user
    const forum = opts.forum
    const replyId = opts.replyId

    return find()
      .findOne()
      .where({_id: id})
      .populate(scopes.ordinary.populate)
      .select(scopes.ordinary.select)
      .exec()
      .then(verifyPrivileges.bind(null, forum, user, replyId))
      .then(doRemoveReply.bind(null, user, replyId))
      .then((comment) => scopes.ordinary.expose(comment, user))
  }
})()

/**
 * Flag comment
 * @method vote
 * @param  {object} opts
 * @param {string} opts.id - Comment Id
 * @param {document} opts.user - Author of the vote
 * @return {promise}
 */
exports.flag = function flag (opts) {
  const id = opts.id
  const user = opts.user

  return find()
    .findOne()
    .where({_id: id})
    .populate(scopes.ordinary.populate)
    .select(scopes.ordinary.select)
    .exec()
    .then(verifyAutoFlag.bind(null, user))
    .then(doFlag.bind(null, user))
    .then((comment) => scopes.ordinary.expose(comment, user))
}

function verifyAutoFlag (user, comment) {
  if (comment.author.equals(user._id)) {
    const err = new Error('A user can\'t flag his own comment.')
    err.code = 'NO_AUTO_FLAG'
    throw err
  }
  return comment
}

function doFlag (user, comment) {
  return new Promise((resolve, reject) => {
    comment.flag(user, 'spam', function (err) {
      if (err) return reject(err)
      resolve(comment)
    })
  })
}

/**
 * Flag comment
 * @method vote
 * @param  {object} opts
 * @param {string} opts.id - Comment Id
 * @param {document} opts.user - Author of the vote
 * @return {promise}
 */
exports.unflag = function flag (opts) {
  const id = opts.id
  const user = opts.user

  return find()
    .findOne()
    .where({_id: id})
    .populate(scopes.ordinary.populate)
    .select(scopes.ordinary.select)
    .exec()
    .then(verifyAutoUnflag.bind(null, user))
    .then(doUnflag.bind(null, user))
    .then((comment) => scopes.ordinary.expose(comment, user))
}

function verifyAutoUnflag (user, comment) {
  if (comment.author.equals(user._id)) {
    const err = new Error('A user can\'t flag his own comment.')
    err.code = 'NO_AUTO_FLAG'
    throw err
  }
  return comment
}

function doUnflag (user, value, comment) {
  return new Promise((resolve, reject) => {
    comment.unflag(user, function (err) {
      if (err) return reject(err)
      resolve(comment)
    })
  })
}

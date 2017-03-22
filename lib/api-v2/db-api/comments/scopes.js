const expose = require('lib/utils').expose
const userScopes = require('../users/scopes')

exports.ordinary = {}

exports.ordinary.keys = {
  expose: [
    'id',
    'text',
    'createdAt',
    'editedAt',
    'reference',
    'flags',
    'score',
    'repliesCount',
    'replies'
  ],

  select: [
    'replies',
    'author',
    'votes',
    'context'
  ]
}

exports.ordinary.populate = {
  path: 'author replies.author',
  select: userScopes.ordinary.select
}

exports.ordinary.select = exports.ordinary.keys.expose.concat(
  exports.ordinary.keys.select
).join(' ')

exports.ordinary.expose = (function () {
  const exposeFields = expose(exports.ordinary.keys.expose.concat(
    userScopes.ordinary.keys.expose.map((v) => `author.${v}`)
  ))

  function exposeComment (comment) {
    const json = exposeFields(comment)

    json.replies.forEach((reply) => {
      reply.author = userScopes.ordinary.expose(reply.author)
    })

    return json
  }

  return function ordinaryExpose (comment, user) {
    const json = exposeComment(comment.toJSON())
    if (user) json.currentUser = currentUserFields(comment, user)
    return json
  }
})()

function currentUserFields (comment, user) {
  const vote = comment && comment.voteOf(user)
  return {
    voted: !!vote,
    upvoted: !!vote && vote.value === 'positive',
    downvoted: !!vote && vote.value === 'negative'
  }
}

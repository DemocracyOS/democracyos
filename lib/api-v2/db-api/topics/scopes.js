const expose = require('lib/utils').expose
const userScopes = require('../users/scopes')

exports.ordinary = {}

exports.ordinary.keys = {
  expose: [
    'id',
    'topicId',
    'title',
    'mediaTitle',
    'status',
    'open',
    'closed',
    'public',
    'draft',
    'deleted',
    'forum',
    'tag',
    'participants',
    'voted',
    'createdAt',
    'updatedAt',
    'closingAt',
    'coverUrl',
    'publishedAt',
    'deletedAt',
    'votable',
    'author',
    'authorUrl',
    'summary',
    'clauses',
    'source',
    'state',
    'upvotes',
    'downvotes',
    'abstentions',
    'action.method',
    'links'
  ],

  select: [
    'action'
  ]
}

exports.ordinary.populate = {
  path: 'action.voteResults.author',
  select: userScopes.ordinary.select
}

exports.ordinary.select = exports.ordinary.keys.expose.concat(
  exports.ordinary.keys.select
).join(' ')

exports.ordinary.expose = (function () {
  const exposeFields = expose(exports.ordinary.keys.expose)

  function exposeTopic (topic) {
    const json = exposeFields(topic)

    ;[
      'upvotes',
      'downvotes',
      'abstentions'
    ].forEach((k) => {
      json[k] = json[k].map(userScopes.ordinary.expose)
    })

    return json
  }

  return function ordinaryExpose (topic, user) {
    const json = exposeTopic(topic.toJSON())
    json.voted = topic.votedBy(user)
    return json
  }
})()

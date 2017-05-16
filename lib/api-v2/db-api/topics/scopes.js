const expose = require('lib/utils').expose
const privilegesTopic = require('lib/privileges/topic')
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
    'tags',
    'participants',
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
    'action.pollOptions',
    'action.pollResults',
    'action.voteResults',
    'links',
    'attrs',
    'owner'
  ],

  select: [
    'action',
    'action.causeResults'
  ]
}

exports.ordinary.populate = [
  {
    path: 'participants',
    select: userScopes.ordinary.select
  },
  {
    path: 'owner',
    select: userScopes.ordinary.select
  },
  {
    path: 'action.voteResults.author',
    select: userScopes.ordinary.select
  },
  {
    path: 'action.pollResults.author',
    select: userScopes.ordinary.select
  },
  {
    path: 'tag',
    select: 'id hash name color image'
  }
]

exports.ordinary.select = exports.ordinary.keys.expose.concat(
  exports.ordinary.keys.select
).join(' ')

exports.ordinary.expose = (function () {
  const exposeFields = expose(exports.ordinary.keys.expose)

  function exposeTopic (topic) {
    const json = exposeFields(topic)

    json.owner = userScopes.ordinary.expose(json.owner)

    ;[
      'upvotes',
      'downvotes',
      'abstentions',
      'participants'
    ].forEach((k) => {
      json[k] = json[k].map(userScopes.ordinary.expose)
    })

    json.action.voteResults = (topic.action.voteResults || []).map((vote) => {
      vote.author = userScopes.ordinary.expose(vote.author)
      return vote
    })

    json.action.pollResults = (json.action.pollResults || []).map((poll) => {
      poll.author = userScopes.ordinary.expose(poll.author)
      return poll
    })

    return json
  }

  return function ordinaryExpose (topic, forum, user) {
    const json = exposeTopic(topic.toJSON())

    json.voted = topic.votedBy(user)
    json.currentUser = currentUserFields(topic, forum, user)
    json.privileges = privilegesTopic.all(forum, user, topic)

    return json
  }
})()

function currentUserFields (topic, forum, user) {
  return {
    action: {
      voted: topic.votedBy(user),
      polled: topic.polledBy(user),
      supported: topic.supportedBy(user)
    }
  }
}

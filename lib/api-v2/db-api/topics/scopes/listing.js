const expose = require('lib/utils').expose
const privilegesTopic = require('lib/privileges/topic')
const userScopes = require('../../users/scopes')

const scope = module.exports = {}

scope.keys = {
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
    'participantsCount',
    'createdAt',
    'updatedAt',
    'closingAt',
    'coverUrl',
    'publishedAt',
    'deletedAt',
    'votable',
    'author',
    'authorUrl',
    'source',
    'state',
    'upvotes',
    'downvotes',
    'abstentions',
    'action.method',
    'action.pollOptions',
    'action.voteResults',
    'links',
    'attrs',
    'owner'
  ],

  select: [
    'action',
    'action.causeResults',
    'action.pollResults'
  ]
}

scope.populate = [
  {
    path: 'owner',
    select: userScopes.ordinary.select
  },
  {
    path: 'tag',
    select: 'id hash name color image'
  }
]

scope.select = scope.keys.expose.concat(
  scope.keys.select
).join(' ')

scope.expose = (function () {
  const exposeFields = expose(scope.keys.expose)

  function exposeTopic (topic) {
    const json = exposeFields(topic)

    json.owner = userScopes.ordinary.expose(json.owner)

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

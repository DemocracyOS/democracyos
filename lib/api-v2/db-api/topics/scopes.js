const expose = require('lib/utils').expose
const privilegesTopic = require('lib/privileges/topic')
const userScopes = require('../users/scopes')
const votedBy = require('./utils').votedBy

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
    'action.method',
    'action.results',
    'action.count',
    'links',
    'attrs',
    'owner'
  ],

  select: [
    'action'
  ]
}

exports.ordinary.populate = [
  {
    path: 'owner',
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

    return json
  }

  return function ordinaryExpose (topic, forum, user) {
    return votedBy(user, topic).then((voted) => {
      const json = exposeTopic(topic.toJSON())

      json.voted = voted
      json.privileges = privilegesTopic.all(forum, user, topic)

      return json
    })
  }
})()

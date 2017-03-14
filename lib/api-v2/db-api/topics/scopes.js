const expose = require('lib/utils').expose

const topicListKeys = module.exports.topicListKeys = [
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
  'clauseTruncationText',
  'author',
  'authorUrl'
]

const topicKeys = module.exports.topicKeys = topicListKeys.concat([
  'summary',
  'clauses',
  'source',
  'state',
  'upvotes',
  'downvotes',
  'abstentions',
  'links'
])

exports.exposeTopic = function exposeTopic (topicDoc, user, keys) {
  if (!keys) keys = topicKeys

  var topic = topicDoc.toJSON()
  topic.voted = topicDoc.votedBy(user)

  return expose(keys)(topic)
}

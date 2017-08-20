const Vote = require('lib/models').Vote

/**
* Check for vote status of user
*
* @param {ObjectId} user
* @api public
*/

function votedBy (user, topic) {
  if (!user || (topic.action.count === 0)) return Promise.resolve(false)
  return Vote.find({topic: topic.id, author: user.id}).then(topicVote => !!topicVote)
}

exports.votedBy = votedBy

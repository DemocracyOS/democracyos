const { Vote } = require('lib/models')

/**
* Check for vote status of user
*
* @param {ObjectId} user
* @param {ObjectId} topic
* @api public
*/

exports.votedBy = function votedBy (user, topic) {
  if (!user || (topic.action.count === 0)) return Promise.resolve(false)
  return Vote.find({ topic: topic._id, author: user._id }).then((topicVote) => topicVote.length > 0 && topicVote[0].value)
}

/**
* Calculate votes results
*
* @param {ObjectId} topic
* @api public
*/

exports.calcResult = function calcResult (topic) {
  return Vote.find({ topic: topic._id }).then((votes) => {
    const options = topic.action.results.map((o) => o.value)

    const votesCounts = votes.reduce(function (counts, vote) {
      if (!counts[vote.value]) counts[vote.value] = 0
      counts[vote.value]++
      return counts
    }, {})

    const votesPercentages = {}

    options.forEach((opt) => {
      if (!votesCounts[opt]) votesCounts[opt] = 0
      votesPercentages[opt] = 100 / votes.length * votesCounts[opt] || 0
    })

    return {
      results: options.map((opt) => ({
        value: opt,
        percentage: parseFloat(votesPercentages[opt].toFixed(2))
      })),
      count: votes.length
    }
  })
}

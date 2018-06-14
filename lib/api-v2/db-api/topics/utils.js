const difference = require('lodash.difference')
const { Vote } = require('lib/models')

/**
* Remove vote to change it.
*
* @param {ObjectId} user
* @param {ObjectId} topic
* @api public
*/

exports.removeOwnVote = function (user, topic) {
  return Vote.remove({ topic: topic._id, author: user._id })
    .then((writeOpResult) => writeOpResult.nMatched !== 0)
}

/**
* Check for vote status of user
*
* @param {ObjectId} user
* @param {ObjectId} topic
* @api public
*/

exports.votedBy = function votedBy (user, topic) {
  if (!user || (topic.action.count === 0)) return Promise.resolve(false)
  return Vote.find({ topic: topic._id, author: user._id }).then((topicVote) =>
    topicVote.length > 0 && topicVote[0].value
  )
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
    const votesPercentages = {}

    if (topic.action.method === 'hierarchy') {
      let result = []
      let fieldsToExclude = []

      const values = votes.map((vote) => vote.value.split(','))

      const count = countByPosition(values, options)

      const levels = Array(count.length).fill().map(Object)

      const optionsWithMaxVotes = getOptionsWithVotes(levels, count)

      optionsWithMaxVotes.forEach((level, index) => {
        result.push(...getMaxValues(optionsWithMaxVotes, level, index, fieldsToExclude))
      })

      const value = Object.keys(Object.assign({}, ...result))

      return {
        results: value.map((val, index) => ({
          value: val,
          position: index + 1
        })),
        matriz: count,
        count: votes.length
      }
    } else {
      const votesCounts = votes.reduce(function (counts, vote) {
        if (!counts[vote.value]) counts[vote.value] = 0
        counts[vote.value]++
        return counts
      }, {})

      options.forEach((opt) => {
        if (!votesCounts[opt]) votesCounts[opt] = 0
        votesPercentages[opt] = 100 / votes.length * votesCounts[opt] || 0
      })

      return {
        results: options.map((opt) => ({
          value: opt,
          percentage: parseFloat(votesPercentages[opt].toFixed(2)),
          votes: votesCounts[opt]
        })),
        count: votes.length
      }
    }
  })
}

/**
* Order options by votes.
*
* @param {Array} options
* @param {Array} optionsArray
* @api public
*/

function countByPosition (values, options) {
  const positions = []
  const count = []

  values.forEach((value) => {
    value.forEach((v, index) => {
      if (!positions[index]) positions[index] = []
      positions[index].push(v)
    })
  })

  positions.forEach((position) => {
    const map = position.reduce((prev, cur) => {
      prev[cur] = (prev[cur] || 0) + 1
      return prev
    }, {})
    count.push(map)
  })

  options.forEach((opt) => {
    count.forEach((position) => {
      if (!position[opt]) position[opt] = 0
    })
  })

  return count
}

/**
* Sum votes including deep positions.
*
* @param {Array} result
* @param {Array} count
* @param {Number} position
* @api public
*/

function getOptionsWithVotes (result, count, position = 0) {
  // Sum votes including deep positions.
  Object.keys(count[position]).forEach((field, index) => {
    for (let positionCount = 0; positionCount <= position; positionCount++) {
      result[position][field] = (result[position][field] || 0) + count[positionCount][field]
    }
  })

  if (typeof result[position + 1] !== 'undefined') getOptionsWithVotes(result, count, position + 1)

  return result
}

/**
* Get the winning proposal per position.
*
* @param {Array} optionsWithMaxVotes
* @param {Array} level
* @param {Number} index
* @param {Array} fieldsToExclude
* @param {Array} fieldsTofind
* @api public
*/

function getMaxValues (optionsWithMaxVotes, level, index, fieldsToExclude = [], fieldsTofind = []) {
  let maxField = []
  let whereFind = !fieldsTofind.lenght ? difference(Object.keys(level), fieldsToExclude) : difference(fieldsTofind, fieldsToExclude)

  whereFind.forEach((field, index) => {
    if (!maxField.length) {
      maxField.push({ [field]: level[field] })
    } else {
      maxField.forEach((obj) => {
        const values = Object.keys(obj).map((key) => obj[key]) // === Object.values.
        values.forEach((value) => {
          if (value === level[field]) {
            maxField.push({ [field]: level[field] })
          }
          if (value < level[field]) {
            maxField = []
            maxField.push({ [field]: level[field] })
          }
        })
      })
    }
  })

  if (maxField.length > 1) {
    maxField = getMaxValues(optionsWithMaxVotes, optionsWithMaxVotes[index + 1], index + 1, fieldsToExclude, Object.keys(maxField))
  }

  fieldsToExclude.push(...Object.keys(maxField[0]))

  return maxField
}

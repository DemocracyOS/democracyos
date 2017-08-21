require('lib/models')()

const ObjectID = require('mongodb').ObjectID
const Topic = require('lib/models').Topic
const dbReady = require('lib/models').ready

const mapPromises = (fn) => (array) => Promise.all(array.map(fn))

function votingResults (votes, options) {
  const votesTotal = votes.length

  const votesCounts = votes.reduce((counts, result) => {
    if (!counts[result.value]) counts[result.value] = 0
    counts[result.value]++
    return counts
  }, {})

  const votesPercentages = {}

  options.forEach((opt) => {
    if (!votesCounts[opt]) votesCounts[opt] = 0
    votesPercentages[opt] = 100 / votesTotal * votesCounts[opt] || 0
  })

  return options.map((opt) => ({
    value: opt,
    percentage: parseFloat(votesPercentages[opt].toFixed(2))
  }))
}

exports.up = function up (done) {
  dbReady()
    .then(() => Topic.collection.find({}).toArray())
    .then(mapPromises(function (topic) {
      if (topic.action && Object.keys(topic.action).includes('box')) return Promise.resolve(0)
      const action = {
        _id: new ObjectID(),
        method: topic.action ? topic.action.method : ''
      }

      switch (topic.action && topic.action.method) {
        case 'vote':
          action.box = topic.action.voteResults
          action.results = [{ value: 'positive', percentage: 0 }, { value: 'neutral', percentage: 0 }, { value: 'negative', percentage: 0 }]
          break
        case 'poll':
          action.box = topic.action.pollResults
          action.results = topic.action.pollOptions.map((o) => ({ value: o, percentage: 0 }))
          break
        case 'cause':
          action.box = topic.action.causeResults.map((r) => {
            r.value = 'support'
            return r
          })
          action.results = [{ value: 'support', percentage: 0 }]
          break
        default:
          action.box = []
          action.results = []
      }

      if (!action.box) {
        action.box = []
        action.results = []
      }

      action.count = action.box.length
      action.results = votingResults(action.box, action.results.map((o) => o.value))

      return Topic.collection.findOneAndUpdate({ _id: topic._id }, {
        $unset: { 'action.voteResults': '', 'action.pollResults': '', 'action.causeResults': '', 'action.pollOptions': '', 'participants': '', 'participantsCount': '' }
      }).then((r) => Topic.collection.findOneAndUpdate({ _id: topic._id }, {
        $set: {
          action: action
        }
      }))
    }))
    .then(function (results) {
      const total = results.filter((v) => !!v).length
      console.log(`refactor topics action from ${total} topics succeded.`)
      done()
    })
    .catch(function (err) {
      console.log('refactor topics action failed at ', err)
      done(err)
    })
}

exports.down = function down (done) {
  dbReady()
    .then(() => Topic.collection.find({}).toArray())
    .then(mapPromises(function (topic) {
      if (!topic.action || !Object.keys(topic.action).includes('box')) return Promise.resolve(0)
      const action = {
        _id: new ObjectID(),
        method: topic.action.method
      }

      switch (topic.action.method) {
        case 'vote':
          action.voteResults = topic.action.box
          break
        case 'poll':
          action.pollResults = topic.action.box
          action.pollOptions = topic.action.results.map((o) => o.value)
          break
        case 'cause':
          action.causeResults = topic.action.box
          break
      }

      return Topic.collection.findOneAndUpdate({ _id: topic._id }, {
        $set: {
          'action': action,
          'participants': action.box || [],
          'participantsCount': action.box ? action.box.length : 0
        }
      })
    }))
    .then(function (results) {
      const total = results.filter((v) => !!v).length
      console.log(`refactor topics action from ${total} topics succeded.`)
      done()
    })
    .catch(function (err) {
      console.log('refactor topics action failed at ', err)
      done(err)
    })
}

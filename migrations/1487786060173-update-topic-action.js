require('lib/models')()

const ObjectID = require('mongoose').Types.ObjectId
const Topic = require('lib/models').Topic
const dbReady = require('lib/models').ready

const mapPromises = (fn) => (array) => Promise.all(array.map(fn))

exports.up = function up (done) {
  dbReady()
    .then(() => Topic.collection.find({}).toArray())
    .then(mapPromises(function (topic) {
      const action = {}
      action.method = topic.votable ? 'vote' : ''
      if (topic.votes) action.voteResults = topic.votes

      action._id = new ObjectID()
      return Topic.collection.findOneAndUpdate({ _id: topic._id }, {
        $unset: { votes: '', votable: '' }
      }).then(() => Topic.collection.findOneAndUpdate({ _id: topic._id }, {
        $set: {
          action: action
        }
      }))
    }))
    .then(function (results) {
      const total = results.filter((v) => !!v).length
      console.log(`update topics action from ${total} topics succeded.`)
      done()
    })
    .catch(function (err) {
      console.log('update topics action failed at ', err)
      done(err)
    })
}

exports.down = function down (done) {
  dbReady()
    .then(function () {
      return Topic.collection
        .find({})
        .toArray()
    })
    .then(mapPromises(function (topic) {
      if (!topic.action) return false

      return Topic.collection.findOneAndUpdate({ _id: topic._id }, {
        $unset: { action: '' },
        $set: {
          votable: topic.action.method === 'vote',
          votes: topic.action.voteResults
        }
      })
    }))
    .then(function (results) {
      const total = results.filter((v) => !!v).length
      console.log(`update topics action from ${total} topics succeded.`)
      done()
    })
    .catch(function (err) {
      console.log('update topics action failed at', err)
      done(err)
    })
}

'use strict'

require('lib/models')()
const Topic = require('lib/models').Topic
const dbReady = require('lib/models').ready()

function mapPromises (fn) {
  return function (array) {
    return Promise.all(array.map(fn))
  }
}

exports.up = function up (done) {
  dbReady
    .then(function () {
      return Topic.collection
        .find({})
        .toArray()
    })
    .then(mapPromises(function (topic) {
      if (!topic.votes) return Promise.resolve(0)
      var action = {}
      action.method = topic.votable ? 'vote' : ''
      if (topic.votes) {
        action.voteResults = topic.votes
      }
      return Topic.collection.findOneAndUpdate({ _id: topic._id }, {
        $unset: { votes: '', votable: '' },
        $set: {
          action: action
        }
      })
    }))
    .then(function (results) {
      console.log('update topics action from ' + results.filter((v) => !!v).length + ' topics succeded')
      done()
    })
    .catch(function (err) {
      console.log('update topics action failed at ', err)
    })
}

exports.down = function down (done) {
  dbReady
    .then(function () {
      return Topic.collection
        .find({})
        .toArray()
    })
    .then(mapPromises(function (topic) {
      if (!topic.action) return Promise.resolve(0)
      return Topic.collection.findOneAndUpdate({ _id: topic._id }, {
        $unset: { action: '' },
        $set: {
          votable: !!topic.action.voteResults,
          votes: topic.action.voteResults
        }
      })
    }))
    .then(function (results) {
      console.log('update topics action from ' + results.filter((v) => v).length + ' topics succeded')
      done()
    })
    .catch(function (err) {
      console.log('update topics action failed at', err)
    })
}

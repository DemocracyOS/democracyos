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
      return Topic
        .find({})
        .populate('forum')
        .exec()
    })
    .then(mapPromises(function (topic) {
      if (topic.owner) return Promise.resolve(0)
      topic.owner = topic.forum.owner
      return topic.save()
    }))
    .then(function (results) {
      console.log('add topics owner from ' + results.filter((v) => !!v).length + ' topics succeded')
      done()
    })
    .catch(function (err) {
      console.log('add topics owner failed at ', err)
    })
}

exports.down = function down (done) {
  dbReady
    .then(function () {
      return Topic
        .find({})
        .populate('forum')
        .exec()
    })
    .then(mapPromises(function (topic) {
      if (!topic.owner) return Promise.resolve(0)
      return Topic.collection.findOneAndUpdate({ _id: topic._id }, { $unset: { owner: '' } })
    }))
    .then(function (results) {
      console.log('remove topic owner from ' + results.filter((v) => v).length + ' topics succeded')
      done()
    })
    .catch(function (err) {
      console.log('remove topic owner failed at', err)
    })
}

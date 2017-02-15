'use strict'

require('lib/models')()
var api = require('lib/db-api')
const Topic = require('lib/models').Topic
const Forum = require('lib/models').Forum

/**
 * Make any changes you need to make to the database here
 */
exports.up = function up (done) {
  console.log('add topic owner')
  Topic.find({}, function (err, topics) {
    if (err) {
      console.log('get all topics error fail ', err.message)
      return
    }

    Promise.all(topics.map(function (topic) {
      if (!topic.hasOwnProperty('owner')) {
        return new Promise(function (resolve, reject) {
          Forum
            .where({ _id: topic.forum })
            .findOne(function (err, forum) {
              if (err) return reject('get forum ' + topic.forum + ' error')
              if (!forum) {
                console.log('no forum with id ', topic.forum)
                return resolve()
              }

              topic.owner = forum.owner
              topic.save(function (err) {
                if (err) return reject('save topic ' + JSON.stringify(err))
                console.log('topic ' + topic.id + ' updated')
                return resolve()
              })
            })
        })
      } else {
        return Promise.resolve()
      }
    }))
    .then(function () {
      console.log('topic add owner success')
      done()
    })
    .catch(function (err) {
      console.log('topic add owner failed at ', err)
      done()
    })
  })
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
exports.down = function down (done) {
  console.log('remove topic owner')
  Topic.find({}, function (err, topics) {
    if (err) {
      console.log('get all topics error fail', err.message)
      return
    }

    Promise.all(topics.map(function (topic) {
      if (!topic.hasOwnProperty('owner')) {
        return new Promise(function (resolve, reject) {
          Forum
            .where({ _id: topic.forum })
            .findOne(function (err, forum) {
              if (err) return reject('get forum ' + topic.forum + ' error')
              if (!forum) {
                console.log('no forum with id ', topic.forum)
                return resolve()
              }

              if (!topic.hasOwnProperty('owner')) return resolve()

              delete topic.owner

              topic.save(function (err) {
                if (err) return reject('save topic ' + JSON.stringify(err))
                console.log('topic ' + topic.id + ' updated')
                return resolve()
              })
            })
        })
      } else {
        return Promise.resolve()
      }
    }))
    .then(function () {
      console.log('topic add owner success')
      done()
    })
    .catch(function (err) {
      console.log('topic add owner failed at', err)
      done()
    })
  })
}

'use strict';
require('lib/models')()

const Topic = require('lib/models').Topic
var api = require('lib/db-api')


/**
 * Make any changes you need to make to the database here
 */
exports.up = function up (done) {
  console.log('add topic owner')
  Topic.find({}, function(err, topics) {
    if(err) {
      console.log('get all topics error fail ', err.message)
      return
    }

    Promise.all(topics.map(function(topic) {
      if(!topic.hasOwnProperty('owner')) {
        return new Promise(function(resolve, reject){
          api.forum.findById(topic.forum, function(err, forum) {
            if(err) return reject('get forum err')
            topic.owner = forum.owner
            topic.save(function (err) {
              if (err) return reject('An error occurred while saving topic: %s', err)
              resolve()
            })
          })
        })
      } else {
        return Promise.resolve()
      }
    }))
    .then(done)
    .catch(function(err){
      console.log('topic add owner failed', err)
    })
  })
};

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
exports.down = function down(done) {
  console.log('remove topic owner')
  Topic.find({}, function(err, topics) {
    if(err) {
      console.log('get all topics error fail ', err.message)
      return
    }

    Promise.all(topics.map(function(topic) {
      if(!topic.hasOwnProperty('owner')) {
        return new Promise(function(resolve, reject){
          api.forum.findById(topic.forum, function(err, forum) {
            if(err) return reject('get forum err')
            delete topic.owner
            topic.save(function (err) {
              if (err) return reject('An error occurred while saving topic: %s', err)
              resolve()
            })
          })
        })
      } else {
        return Promise.resolve()
      }
    }))
    .then(done)
    .catch(function(err){
      console.log('topic add owner failed', err)
    })
  })
};

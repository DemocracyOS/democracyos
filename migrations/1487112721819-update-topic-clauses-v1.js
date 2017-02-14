'use strict'

var api = require('lib/db-api')
require('lib/models')()

const Topic = require('lib/models').Topic

/**
 * Performs a topic migration to v2 supposing it has v1 structure.
 * @param topic The topic mongoose document
 * @param cb A callback function with two params: err and topic, that represents the migrated topic
 * @api private
 */

function migrateV1V2 (topic, cb) {
  console.log('Starting migration from v1')
  var data = {}
  data.clauses = topic.clauses.map(function (clause) {
    console.log('Migrating clause %s', clause._id.toString())
    return {
      id: clause._id,
      markup: '<div>' + clause._doc.text + '</div>',
      position: clause._doc.order,
      empty: false
    }
  })

  console.log('Migrating summary')
  data.clauses.push({
    markup: '<div>' + topic._doc.summary + '</div>',
    position: -1,
    empty: false
  })

  topic.set(data)
  console.log('Saving topic')
  topic.save(function (err) {
    if (err) {
      console.log('An error occurred while saving topic: %s', err)
      return cb(err)
    }
    console.log('Topic saved, updating side comments...')
    return updateSideComments(topic, cb)
  })

  function updateSideComments (topic, cb) {
    for (var i = 0; i < topic.clauses.length; i++) {
      var clause = topic.clauses[i]
      var context = (clause.position === -1) ? 'summary' : 'clause'
      var reference
      if (context === 'summary') {
        reference = topic._id.toString() + '-0'
      } else {
        reference = clause._id.toString()
      }
      var query = {
        context: context,
        reference: reference
      }
      var data = {
        reference: clause._id,
        context: 'paragraph',
        topicId: topic._id
      }

      console.log('Updating %j with %j', query, data)

      api.comment.update(query, data, function (err) {
        if (err) {
          console.log('Error saving comment: ' + err.toString())
        }
        console.log('comment.save() => OK!')
      })
    }

    return cb(null, topic)
  }
}

exports.up = function(done) {
  console.log('topic clause v1 update start')
  Topic.find({}, function(err, topics) {
    if(err) {
      console.log('get all topics fail ', err.message)
      return
    }


    Promise.all(topics.map(function(topic) {
      if(topic.guessVersion() === 1)
        return new Promise(function(resolve, reject){
          migrateV1V2(topic, function(err){
            if(err) return reject('error at migrate topic v1 to v2 ' + topic.id)
            resolve()
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

exports.down = function(next) {
  throw new Error('topic: v2 to v1 not implemented')
};

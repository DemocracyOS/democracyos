'use strict'

var log = require('debug')('democracyos:migrations:topic')
require('lib/models')()

const Topic = require('lib/models').Topic

/**
 * Performs a topic migration supposing it has v1 structure.
 * @param topic The topic mongoose document
 * @param cb A callback function with two params: err and topic, that represents the migrated topic
 * @api private
 */

function migrateV1 (topic, cb) {
  log('Starting migration from v1')
  var data = {}
  data.clauses = topic.clauses.map(function (clause) {
    log('Migrating clause %s', clause._id.toString())
    return {
      id: clause._id,
      markup: '<div>' + clause._doc.text + '</div>',
      position: clause._doc.order,
      empty: false
    }
  })

  log('Migrating summary')
  data.clauses.push({
    markup: '<div>' + topic._doc.summary + '</div>',
    position: -1,
    empty: false
  })

  topic.set(data)
  log('Saving topic')
  topic.save(function (err) {
    if (err) {
      log('An error occurred while saving topic: %s', err)
      return cb(err)
    }
    log('Topic saved, updating side comments...')
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

      log('Updating %j with %j', query, data)

      api.comment.update(query, data, function (err) {
        if (err) {
          log('Error saving comment: ' + err.toString())
        }
        log('comment.save() => OK!')
      })
    }

    return cb(null, topic)
  }
}

exports.up = function(next) {
  log('topic v1 to v2 start')
  Topic.find({}, function(err, topics) {
    if(err) return log('get all topics to migrate fail')
    topics.forEach(function(topic) {
      if(topic.guessVersion() === 1) return migrateV1(topic, function(err){
        if(err) log('error at migrate topic v1 to v2 ' + topic.id)
      })
    })
  })
  next();
};

exports.down = function(next) {
  next();
};

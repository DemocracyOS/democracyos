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

function migrateV2 (topic, cb) {
  var html = topic._doc.summary
  var document = getDOM(html)
  log('topic.summary: ' + html)
  var divs = document.getElementsByTagName('div')
  for (var i in divs) {
    if (divs.hasOwnProperty(i)) {
      var div = divs[i]
      var markup = div.outerHTML
      log('topic.clauses[' + i + ']: ' + markup)
      // TODO: Detect <br /> and set empty to true
      var doc = {
        markup: markup,
        position: i,
        empty: false
      }
      topic.clauses.push(doc)

      // The newly created clause ID
      var clauseId = topic.clauses[topic.clauses.length - 1]._id.toString()
      log('topic.clauses[' + i + '].id: ' + clauseId)

      // Now update its side-comments
      var reference = topic._id + '-' + (+i)
      log('Getting comments for ' + 'summary' + ' referenced to ' + reference)

      var query = {
        context: 'summary',
        reference: reference
      }
      var data = {
        reference: clauseId,
        context: 'paragraph',
        topicId: topic._id
      }

      api.comment.update(query, data, function (err) {
        if (err) {
          log('Error saving comment: ' + err.toString())
        }
        log('comment.save() => OK!')
      })
    }
  }

  topic.save(function (err) {
    if (err) {
      log('Error saving topic: ' + err.toString())
      return cb(err)
    }
    log('Topic saved!')
    return cb(null, topic)
  })
}

exports.up = function(next) {
  console.log('topic v2 to v3 start')
  log('topic v2 to v3 start')
  Topic.find({}, function(error, topics) {
    topics.forEach(function(topic) {
      if(topic.guessVersion() === 2) return migrateV2(topic, function(err){
        if(err) log('error at migrate topic v1 to v2 ' + topic.id)
      })
    })
  })
  next();
};

exports.down = function(next) {
  next();
};

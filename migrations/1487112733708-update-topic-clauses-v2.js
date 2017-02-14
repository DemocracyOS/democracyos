'use strict'

var jsdom = require('jsdom').jsdom;
var api = require('lib/db-api')

require('lib/models')()
const Topic = require('lib/models').Topic

function getDOM (str) {
  var dom = jsdom(str);
  return dom.documentElement;

}
/**
 * Performs a topic migration supposing it has v1 structure.
 * @param topic The topic mongoose document
 * @param cb A callback function with two params: err and topic, that represents the migrated topic
 * @api private
 */

function migrateV2 (topic, cb) {
  var html = topic._doc.summary
  var document = getDOM(html)
  console.log('topic.summary: ' + html)
  var divs = document.getElementsByTagName('div')
  for (var i in divs) {
    if (divs.hasOwnProperty(i)) {
      var div = divs[i]
      var markup = div.outerHTML
      console.log('topic.clauses[' + i + ']: ' + markup)
      // TODO: Detect <br /> and set empty to true
      var doc = {
        markup: markup,
        position: i,
        empty: false
      }
      topic.clauses.push(doc)

      // The newly created clause ID
      var clauseId = topic.clauses[topic.clauses.length - 1]._id.toString()
      console.log('topic.clauses[' + i + '].id: ' + clauseId)

      // Now update its side-comments
      var reference = topic._id + '-' + (+i)
      console.log('Getting comments for ' + 'summary' + ' referenced to ' + reference)

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
          console.log('Error saving comment: ' + err.toString())
        }
        console.log('comment.save() => OK!')
      })
    }
  }

  topic.save(function (err) {
    if (err) {
      console.log('Error saving topic: ' + err.toString())
      return cb(err)
    }
    console.log('Topic saved!')
    return cb(null, topic)
  })
}

exports.up = function(done) {
  console.log('topic clause v2 update start')
  Topic.find({}, function(err, topics) {
    if(err) {
      console.log('get all topics fail ', err.message)
      return
    }


    Promise.all(topics.map(function(topic) {
      if(topic.guessVersion() === 2)
      return new Promise(function(resolve, reject){
          migrateV2(topic, function(err){
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
  throw new Error('topic: v3 to v2 not implemented')
};

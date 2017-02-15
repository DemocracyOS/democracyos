'use strict'

var jsdom = require('jsdom').jsdom
require('lib/models')()
var api = require('lib/db-api')
const Topic = require('lib/models').Topic

function getDOM (str) {
  var dom = jsdom(str)
  return dom.documentElement
}
/**
 * Performs a topic migration supposing it has v1 structure.
 * @param topic The topic mongoose document
 * @param cb A callback function with two params: err and topic, that represents the migrated topic
 * @api private
 */

function migrateV2 (topic, cb) {
  console.log('Migrating topic ' + topic.id + ' clause v2')
  var html = topic._doc.summary
  var document = getDOM(html)
  var divs = document.getElementsByTagName('div')
  var commentsUpdates = []
  for (var i in divs) {
    if (divs.hasOwnProperty(i)) {
      var div = divs[i]
      var markup = div.outerHTML
      // TODO: Detect <br /> and set empty to true
      var doc = {
        markup: markup,
        position: i,
        empty: false
      }
      topic.clauses.push(doc)

      // The newly created clause ID
      var clauseId = topic.clauses[topic.clauses.length - 1]._id.toString()

      // Now update its side-comments
      var reference = topic._id + '-' + (+i)

      var query = {
        context: 'summary',
        reference: reference
      }
      var data = {
        reference: clauseId,
        context: 'paragraph',
        topicId: topic._id
      }

      commentsUpdates.push(new Promise(function (resolve, reject) {
        api.comment.update(query, data, function (err) {
          if (err) {
            console.log('Error saving comment: ' + err.toString())
            return resolve()
          }
          resolve()
        })
      }))
    }
  }

  Promise.all(commentsUpdates)
    .then(function () {
      topic.save(function (err) {
        if (err) {
          console.log('Error saving topic: ' + err.toString())
          return cb(err)
        }
        console.log('Topic saved!')
        return cb(null, topic)
      })
    })
}

exports.up = function (done) {
  console.log('topic clause v2 update start')
  Topic.find({}, function (err, topics) {
    if (err) {
      console.log('get all topics fail ', err.message)
      return
    }

    Promise.all(topics.map(function (topic) {
      if (topic.guessVersion() === 2) {
        return new Promise(function (resolve, reject) {
          migrateV2(topic, function (err) {
            if (err) return reject('error at migrate topic v1 to v2 ' + topic.id)
            resolve()
          })
        })
      } else {
        return Promise.resolve()
      }
    }))
    .then(function () {
      console.log('topic clauses v2 update success')
      done()
    })
    .catch(function (err) {
      console.log('topic clauses v2 update failed', err)
      done()
    })
  })
}

exports.down = function (done) {
  console.log('topic clauses v2 update down migration not implemented')
  done()
}

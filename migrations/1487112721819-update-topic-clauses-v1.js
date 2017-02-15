'use strict'

require('lib/models')()
var api = require('lib/db-api')
const Topic = require('lib/models').Topic

/**
 * Performs a topic migration to v2 supposing it has v1 structure.
 * @param topic The topic mongoose document
 * @param cb A callback function with two params: err and topic, that represents the migrated topic
 * @api private
 */

function migrateV1 (topic, cb) {
  console.log('Migrating topic ' + topic.id + ' clause v1')
  var data = {}
  data.clauses = topic.clauses.map(function (clause) {
    return {
      id: clause._id,
      markup: '<div>' + clause._doc.text + '</div>',
      position: clause._doc.order,
      empty: false
    }
  })

  data.clauses.push({
    markup: '<div>' + topic._doc.summary + '</div>',
    position: -1,
    empty: false
  })

  topic.set(data)
  topic.save(function (err) {
    if (err) {
      console.log('An error occurred while saving topic: %s', err)
      return cb(err)
    }
    return updateSideComments(topic, cb)
  })

  function updateSideComments (topic, cb) {
    Promise.all(topic.clauses.map(function (clause) {
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

      api.comment.update(query, data, function (err) {
        if (err) {
          console.log('Error saving comment: ' + err.toString())
        }
      })
    }))
    .then(() => { cb(null) })
    .catch((err) => console.log(err))
  }
}

exports.up = function (done) {
  console.log('topic clause v1 update start')
  Topic.find({}, function (err, topics) {
    if (err) {
      console.log('get all topics fail ', err.message)
      return
    }

    Promise.all(topics.map(function (topic) {
      if (topic.guessVersion() === 1) {
        return new Promise(function (resolve, reject) {
          migrateV1(topic, function (err) {
            if (err) return reject('error at migrate topic v1 to v2 ' + topic.id)
            resolve()
          })
        })
      } else {
        return Promise.resolve()
      }
    }))
    .then(function () {
      console.log('topic clauses v1 update success')
      done()
    })
    .catch(function (err) {
      console.log('topic clauses v1 update failed', err)
      done()
    })
  })
}

exports.down = function (done) {
  console.log('topic clauses v1 update down migration not implemented')
  done()
}

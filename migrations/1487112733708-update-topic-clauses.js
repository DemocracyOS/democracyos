'use strict'

var jsdom = require('jsdom').jsdom
require('lib/models')()
var api = require('lib/db-api')
const Topic = require('lib/models').Topic

function mapMigrate (model, fn) {
  return new Promise(function (resolve, reject) {
    model.find({}, function (err, items) {
      if (err) {
        console.log(err.message)
        return reject('get all ' + model.modelName + 's to migrate failed ')
      }
      Promise.all(items.map(fn)).then(resolve).catch(reject)
    })
  })
}

function guessVersion (topic) {
  var migratedClauses = topic.clauses.filter(function (clause) {
    return !!clause.markup
  })

  // Migrated and unmigrated clauses may coexist. Better catch it early.
  if (migratedClauses.length) {
    return 3
  }

  // Handle the case when a v1 topic has summary but no clauses
  if (topic._doc.summary && topic._doc.summary.toLowerCase().substring(0, 4) !== '<div') {
    return 1
  }

  if (topic.clauses[0] && topic.clauses[0]._doc && topic.clauses[0]._doc.clauseName) {
    // Topic %s is v1 (very old stuff with clauses)
    return 1
  } else if (topic.clauses[0] && topic.clauses[0]._doc && topic._doc.clauses[0]._doc.markup) {
    // Topic %s is v3 (wrote with a rich text editor in DemocracyOS 1.0) or already migrated
    return 3
  } else if (topic._doc.summary) {
    // Topic %s is v2 (wrote with a rich text editor)
    return 2
  } else {
    // Can't guess topic version
    return 3
  }
}

/**
 * Performs a topic migration to v2 supposing it has v1 structure.
 * @param topic The topic mongoose document
 * @param cb A callback function with two params: err and topic, that represents the migrated topic
 * @api private
 */

function migrateV1 (topic, cb) {
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
        return cb(null, topic)
      })
    })
}

exports.up = function (done) {
  console.log('update topic clauses start')
  var clausesVersionsAcc = { 1: 0, 2: 0, 3: 0 }
  mapMigrate(Topic, function (topic) {
    var versionTopic = guessVersion(topic)
    clausesVersionsAcc[versionTopic]++
    if (versionTopic === 1) {
      return new Promise(function (resolve, reject) {
        migrateV1(topic, function (err) {
          if (err) return reject('error at migrate topic clauses v1 to v3 ' + topic.id)
          resolve(1)
        })
      })
    } else if (versionTopic === 2) {
      return new Promise(function (resolve, reject) {
        migrateV2(topic, function (err) {
          if (err) return reject('error at migrate topic clauses v2 to v3 ' + topic.id)
          resolve(1)
        })
      })
    } else {
      return Promise.resolve(0)
    }
  })
  .then(function (results) {
    console.log('v1: ' + clausesVersionsAcc[1])
    console.log('v2: ' + clausesVersionsAcc[2])
    console.log('v3: ' + clausesVersionsAcc[3])
    console.log('update clauses from ' + results.filter((v) => v).length + ' topics succeded')
    done()
  })
  .catch(function (err) {
    console.log('update topic clauses fail ', err)
    done()
  })
}

exports.down = function (done) {
  console.log('update topic clauses down migration is not implemented')
  done()
}

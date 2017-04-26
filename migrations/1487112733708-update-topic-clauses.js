const jsdom = require('jsdom').jsdom

require('lib/models')()

const Topic = require('lib/models').Topic
const Comment = require('lib/models').Comment
const dbReady = require('lib/models').ready

const mapPromises = (fn) => (array) => Promise.all(array.map(fn))

function guessVersion (topic) {
  const migratedClauses = topic.clauses.filter(function (clause) {
    return !!clause.markup
  })

  // Migrated and unmigrated clauses may coexist. Better catch it early.
  if (migratedClauses.length) {
    return 3
  }

  // Handle the case when a v1 topic has summary but no clauses
  if (topic._doc && topic._doc.summary &&
    topic._doc.summary.toLowerCase().substring(0, 4) !== '<div') {
    return 1
  }

  if (topic.clauses[0] && topic.clauses[0]._doc && topic.clauses[0]._doc.clauseName) {
    // Topic %s is v1 (very old stuff with clauses)
    return 1
  } else if (topic.clauses[0] && topic.clauses[0]._doc && topic._doc.clauses[0]._doc.markup) {
    // Topic %s is v3 (wrote with a rich text editor in DemocracyOS 1.0) or already migrated
    return 3
  } else if (topic._doc && topic._doc.summary) {
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

function migrateV1 (topic) {
  const data = {}

  data.clauses = topic.clauses.map((clause) => ({
    id: clause._id,
    markup: `<div>${clause._doc.text}</div>`,
    position: clause._doc.order,
    empty: false
  }))

  data.clauses.push({
    markup: `<div>${topic._doc && topic._doc.summary}</div>`,
    position: -1,
    empty: false
  })

  return Promise.all([
    Topic.collection.findOneAndUpdate({ _id: topic._id }, {
      $set: {
        clauses: data.clauses
      }
    }),
    mapPromises(function (clause) {
      const context = (clause.position === -1) ? 'summary' : 'clause'

      let reference
      if (context === 'summary') {
        reference = topic._id.toString() + '-0'
      } else {
        reference = clause._id.toString()
      }

      const query = {
        context: context,
        reference: reference
      }

      const data = {
        reference: clause._id,
        context: 'paragraph',
        topicId: topic._id
      }

      return new Promise(function (resolve, reject) {
        Comment.update(query, data, { multi: true }, function (err) {
          if (err) {
            console.log('Error saving comment: ' + err.toString())
          }

          resolve()
        })
      })
    })(topic.clauses)
  ])
}

function getDOM (str) {
  if (!str) return undefined
  var dom = jsdom(str)
  return dom.documentElement
}

/**
 * Performs a topic migration supposing it has v1 structure.
 * @param topic The topic mongoose document
 * @param cb A callback function with two params: err and topic, that represents the migrated topic
 * @api private
 */

function migrateV2 (topic) {
  const html = topic._doc && topic._doc.summary
  const document = getDOM(html)
  if (!document) throw Error('Bad topic _doc')
  const divs = document.getElementsByTagName('div')
  const commentsUpdates = []
  let clauses = topic.clauses

  for (var i in divs) {
    if (divs.hasOwnProperty(i)) {
      const markup = divs[i].outerHTML
      const doc = {
        markup: markup,
        position: i,
        empty: false
      }

      clauses.push(doc)

      // The newly created clause ID
      const clauseId = clauses[clauses.length - 1]._id.toString()

      // Now update its side-comments
      const reference = `${topic._id}-${parseInt(i)}`

      const query = {
        context: 'summary',
        reference: reference
      }

      const data = {
        reference: clauseId,
        context: 'paragraph',
        topicId: topic._id
      }

      commentsUpdates.push(new Promise(function (resolve, reject) {
        Comment.update(query, data, { multi: true }, function (err) {
          if (err) {
            console.log('Error saving comment: ' + err.toString())
          }

          resolve()
        })
      }))
    }
  }

  return Promise.all(commentsUpdates)
    .then(function () {
      return Topic.collection.findOneAndUpdate({ _id: topic._id }, {
        $set: {
          clauses: clauses
        }
      })
    })
}

exports.up = function (done) {
  const clausesVersionsAcc = { 1: 0, 2: 0, 3: 0 }

  dbReady()
    .then(() => Topic.collection
      .find({})
      .toArray()
      .then(mapPromises(function (topic) {
        var versionTopic = guessVersion(topic)
        clausesVersionsAcc[versionTopic]++

        if (versionTopic === 1) {
          return migrateV1(topic)
        } else if (versionTopic === 2) {
          return migrateV2(topic)
        } else {
          return Promise.resolve(0)
        }
      }))
      .then(function (results) {
        console.log('v1: ' + clausesVersionsAcc[1])
        console.log('v2: ' + clausesVersionsAcc[2])
        console.log('v3: ' + clausesVersionsAcc[3])
        console.log('update clauses from ' + results.filter((v) => v).length + ' topics succeded')
        done()
      })
    )
    .catch(function (err) {
      console.log('update topics clauses failed at ', err)
      throw new Error('update topics clauses failed')
    })
}

exports.down = function (done) {
  console.log('update topic clauses down migration is not implemented')
  done()
}

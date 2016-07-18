var api = require('lib/api/db-api')
var log = require('debug')('democracyos:migrations:topic')
var jsdom = require('jsdom').jsdom

/**
 * Gets a HTML `document` element based on a provided HTML markup
 * @api private
 */

function getDOM (str) {
  var dom = jsdom(str)
  return dom.documentElement
}

/**
 * Infers a topic version based on its structure
 * @return Number
 * @api private
 */

function guessVersion (topic) {
  log('Guessing version of topic %s', topic._id)
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
    log('Topic %s is v1 (very old stuff with clauses)')
    return 1
  } else if (topic.clauses[0] && topic.clauses[0]._doc && topic._doc.clauses[0]._doc.markup) {
    log('Topic %s is v3 (wrote with a rich text editor in DemocracyOS 1.0) or already migrated')
    return 3
  } else if (topic._doc.summary) {
    log('Topic %s is v2 (wrote with a rich text editor)')
    return 2
  } else {
    log("Can't guess topic version")
    return 3
  }
}

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

/**
 * Ensures the topic document has a DemocracyOS 1.0 compatible structure
 * This action could alter the document structure and its associated side-comments
 * @param topic The actual topic document
 * @param cb A callback function with two params: err and topic, that represents the migrated topic
 * @api public
 */

module.exports = function migrateTopic (topic, cb) {
  var version = guessVersion(topic)
  if (version === 1) {
    return migrateV1(topic, cb)
  } else if (version === 2) {
    return migrateV2(topic, cb)
  } else {
    // Version 3 does not need to be migrated
    cb(null, topic)
  }
}

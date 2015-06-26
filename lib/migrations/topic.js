var api = require('lib/db-api');
var log = require('debug')('democracyos:migrations:topic');
var jsdom = require('jsdom').jsdom;

/**
 * Gets a HTML `document` element based on a provided HTML markup
 * @api private
 */

function getDOM (str) {
  var dom = jsdom(str);
  return dom.documentElement;
}

/**
 * Infers a topic version based on its structure
 * @return Number
 * @api private
 */

function guessVersion(topic) {
  log('Guessing version of topic %s', topic._id);
  if (topic.clauses[0] && topic.clauses[0]._doc && topic.clauses[0]._doc.clauseName) {
    log('Topic %s is v1 (very old stuff with clauses)');
    return 1;
  } else if (topic._doc.clauses[0]._doc.markup) {
    log('Topic %s is v3 (wrote with a rich text editor in DemocracyOS 1.0) or already migrated');
    return 3;
  } else if (topic._doc.summary) {
    log('Topic %s is v2 (wrote with a rich text editor)');
    return 2;
  } else {
    log('Can\'t guess topic version');
    return 3;
  }
}

/**
 * Performs a topic migration supposing it has v1 structure.
 * @param topic The topic mongoose document
 * @param cb A callback function with two params: err and topic, that represents the migrated topic
 * @api private
 */

function migrateV1(topic, cb) {
  log('Starting migration from v1');
  var data = {};
  // todo: update side-comments
  data.clauses = topic.clauses.map(function (clause) {
    log('Migrating clause %s', clause._id);
    return {
      id: clause._id,
      markup: '<div>' + clause._doc.text + '</div>',
      position: clause._doc.order,
      empty: false
    };
  });

  log('Migrating summary');
  data.clauses.push({
    markup: '<div>' + topic._doc.summary + '</div>',
    position: -1,
    empty: false
  });

  topic.set(data);
  log('Saving')
  topic.save(function (err) {
    if (err) {
      log('An error occurred while saving topic: %s', err);
      return cb(err);
    }
    log('Topic saved!');
    return cb(null, topic);
  });
}

/**
 * Performs a topic migration supposing it has v1 structure.
 * @param topic The topic mongoose document
 * @param cb A callback function with two params: err and topic, that represents the migrated topic
 * @api private
 */

function migrateV2(topic, cb) {
  var html = topic._doc.summary;
  var document = getDOM(html);
  log('topic.summary: ' + html)
  var divs = document.getElementsByTagName('div');
  for (i in divs) {
    if (divs.hasOwnProperty(i)) {
      var div = divs[i];
      var markup = div.outerHTML;
      log('topic.clauses[' + i + ']: ' + markup);
      var doc = {
        markup: markup,
        position: i,
        empty: false
      };
      topic.clauses.push(doc);
      // The newly created clause ID
      var clauseId = topic.clauses[topic.clauses.length - 1]._id;
      log('topic.clauses[' + i + '].id: ' + clauseId);

      // Now update its side-comments
      // var context = 'summary';//(i === 0) ? 'summary' : 'content';
      var reference = topic._id + '-' + (+i + 1);
      log('Getting comments for ' + 'summary' + ' referenced to ' + reference);

      function updateComments(err, comments) {
        log('comments.length: ' + comments.length);
        comments.forEach(function(comment) {
          comment.reference = clauseId;
          comment.context = 'paragraph';
          log('comment.reference: ' + clauseId);
          comment.save(function (err) {
            if (err) {
              log('Error saving comment: ' + err.toString());
            }
            log('comment.save() => OK!');
          })
        });
      }

      function getSideComments(reference, fn) {
        api.comment.get({
            context: 'summary',
            reference: reference
          },
          {
            page: 0,
            limit: 0,
            exclude_user: null
          }, fn);
      }

      getSideComments(reference, updateComments);
    }
  }

  topic.save(function (err) {
    if (err) {
      log('Error saving topic: ' + err.toString());
      return cb(err);
    }
    log('Topic saved!');
    return cb(null, topic);
  });
}

/**
 * Ensures the topic document has a DemocracyOS 1.0 compatible structure
 * This action could alter the document structure and its associated side-comments
 * @param topic The actual topic document
 * @param cb A callback function with two params: err and topic, that represents the migrated topic
 * @api public
 */

module.exports = function migrateTopic(topic, cb) {
  var version = guessVersion(topic);
  if (1 === version) {
    return migrateV1(topic, cb);
  } else if (2 === version) {
    return migrateV2(topic, cb);
  } else {
    // Version 3 does not need to be migrated
    cb(null, topic);
  }
};

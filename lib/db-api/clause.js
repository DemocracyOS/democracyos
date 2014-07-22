/**
 * Extend module's NODE_PATH
 * HACK: temporary solution
 */

require('node-path')(module);

/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var ClauseComment = mongoose.model('ClauseComment');
var lawApi = require('lib/db-api').law;
var log = require('debug')('democracyos:db-api:clause');

/**
 * Creates clause comment
 *
 * @param {ObjectId} lawId for the law
 * @param {ObjectId} clauseId for the clause to be commented
 * @param {Object} data to create the comment
 * @param {Function} fn callback function
 *   - 'err' error found on query or `null`
 *   - 'law' item created or `undefined`
 * @return {Module} `law` module
 * @api public
 */

exports.comment = function comment(lawId, clauseId, data, fn) {
  log('Creating new comment %j for clause %s on law %s', JSON.stringify(data), lawId, clauseId);

  // wrong using tag api within proposal's
  log('Looking for law %s in database.', lawId);
  lawApi.get(lawId, function (err, law) {
    if (err) {
      log('Found error from law search %j', err);
      return fn(err);
    };

    law.clauses.forEach(function (clause) {
      if (clause.id === clauseId) {
        var comment = new ClauseComment(data);
        clause.comments.push(comment);
        law.save(function(err, saved) {
          if (err) {
            log('Found error %j', err)
            return fn(err);
          };

          log('Delivering clause comment %s', comment.id);
          comment.populate('author', function (err, doc) {
            if (err) {
              log('Found error %j', err)
              return fn(err);
            };

            doc.clauseId = clauseId;
            fn(null, doc);
          });
        });
      }
    });
  });

  return this;
};
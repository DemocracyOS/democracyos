/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Comment = mongoose.model('Comment');
  , log = require('debug')('db-api:comment')

/**
 * Get all comments
 *
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'comments' list items found or `undefined`
 * @return {Module} `comment` module
 * @api public
 */

exports.all = function all(fn) {
  log('Looking for all comments.')

  Comment.find(function (err, comments) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering comments %j', mapByProperty(proposals, 'id'));
    fn(null, proposals);
  });

  return this;
};

/**
 * Create comment for `proposal` by `author`
 * with `text`
 *
 * @param {String} proposal to submit comment
 * @param {Object} comment comment vars like `text` and `author`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'comments' list items found or `undefined`
 * @api public
 */

exports.create = function create(proposal, comment, fn) {
  log('Creating new comment %j for proposal %s', comment, proposal);
  
  var comment = new Comment({
    author: comment.author || comment.citizen || comment.user,
    text: comment.text,
    reference: proposal
  });

  comment.save(function (err, saved) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering comment %j', saved);
    fn(null, saved);
  });
};

/**
 * Get comments for proposal
 *
 * @param {String} proposal to get comments from
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'comments' list items found or `undefined`
 * @api public
 */

exports.getFor = function getFor(proposal) {
  log('Looking for comments for proposal %s', proposal);

  Comment.find({reference: proposal}, function(err, comments) {
    if (err) {
      log('Found error %', err);
      return fn(err);
    };

    fn(null, comments);
  });
};

/**
 * Reply to comment
 *
 * @param {String} comment to attach reply
 * @param {Object} reply object
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'comments' list items found or `undefined`
 * @api public
 */

exports.reply = function reply(proposal) {
  // log('Looking for comments for proposal %s', proposal);

  // Comment.find({reference: proposal}, function(err, comments) {
  //   if (err) {
  //     log('Found error %', err);
  //     return fn(err);
  //   };

  //   fn(null, comments);
  // });
};

/**
 * Map array of objects by `property`
 *
 * @param {Array} source array of objects to map
 * @param {String} property to map from objects
 * @return {Array} array of listed properties
 * @api private
 */

function mapByProperty (source, property) {
  return source.map(function(item) { return item[prop]; });
};
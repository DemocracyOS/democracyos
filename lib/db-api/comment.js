/**
 * Extend module's NODE_PATH
 * HACK: temporary solution
 */

require('node-path')(module);

/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');
var utils = require('lib/utils');
var pluck = utils.pluck;
var log = require('debug')('democracyos:db-api:comment');

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

    log('Delivering comments %j', pluck(comments, 'id'));
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

exports.create = function create(comment, fn) {
  log('Creating new comment %j for %s %s', comment.text, comment.context, comment.reference);
  
  var comment = new Comment(comment);

  comment.save(function (err) {
    if (err) {
      log('Found error %s', err);
      return fn(err);
    };
    comment.populate('author', function(err) {
      if (err) {
        log('Found error %s', err)
        return fn(err);
      };
      
      log('Delivering comment %j', comment.id);
      fn(null, comment);
    });
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

exports.getFor = function getFor(query, paging, fn) {
  log('Looking for comments for %s %s', query.context, query.reference);

  paging = paging || { page: 0, limit: 0 }

  Comment
  .find(query)
  .populate('author', 'id firstName lastName fullName email')
  .sort('-createdAt')
  .skip(paging.page * paging.limit)
  .limit(paging.limit)
  .exec(function(err, comments) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering comments %j', pluck(comments, 'id'));
    fn(null, comments);
  });
};

/**
 * Get replies for comment
 *
 * @param {String} id
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'comments' list items found or `undefined`
 * @api public
 */

exports.replies = function replies(id, fn) {
  log('Looking for replies for comment %s', id);

  Comment
  .findOne({ _id: id })
  .populate('replies.author', 'id firstName lastName fullName email')
  .exec(function(err, comment) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    var replies = comment && comment.replies ? comment.replies : [];

    log('Delivering replies %j', pluck(replies, 'id'));
    fn(null, replies);
  });
};

/**
 * Reply to comment
 *
 * @param {String} commentId to attach reply
 * @param {Object} reply object with params
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'comments' list items found or `undefined`
 * @api public
 */

exports.reply = function reply(commentId, reply, fn) {
  log('Looking for comment %s to reply with %j', commentId, reply);

  Comment.findById(commentId, function(err, comment) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Creating reply %j for comment %j', reply, comment);
    var doc = comment.replies.create(reply);
    comment.replies.push(doc);

    comment.save(function(err, saved) {
      if (err) {
        log('Found error %j', err)
      };

      comment
      .populate('replies.author', 'id firstName lastName fullName email', function(err) {
        if (err) {
          log('Found error %j', err);
          return fn(err);
        };

        reply = comment.replies.id(doc.id);

        log('Delivering reply %s', reply.id);
        fn(null, reply);
      });

    });
  });
};

/**
 * Edit a reply
 *
 * @param {Object} comment to attach reply
 * @param {Object} reply object with params
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'comments' list items found or `undefined`
 * @api public
 */

exports.editReply = function editReply(comment, reply, fn) {
  log('Looking for comment %s to reply with %s', comment.id, reply.id);

  reply.editedAt = Date.now();

  Comment.update(
    { _id: comment.id, 'replies._id': reply.id },
    { $set: { 'replies.$.text': reply.text, 'replies.$.editedAt': reply.editedAt } },
    function (err) {
      if (err) {
        log('Found error %j', err);
        return fn(err);
      }

      log('Delivering reply %s', reply.id);
      fn(null, reply);
  });
};

/**
 * Upvote comment
 *
 * @param {String} id
 * @param {Citizen|ObjectId|String} citizen
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'comment' list items found or `undefined`
 * @api public
 */

exports.upvote = function upvote(id, citizen, fn) {
  Comment.findById(id, function(err, comment) {
    if (err) return log('Found error %s', err), fn(err);

    log('Upvoting comment %s', comment.id);
    comment.vote(citizen, 'positive', function(err) {
      if (err) return log('Found error %s', err), fn(err);

      log('Delivering comment %s', comment.id);
      fn(null, comment);
    });
  });
};

/**
 * Downvote comment
 *
 * @param {String} id
 * @param {Citizen|ObjectId|String} citizen
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'comments' list items found or `undefined`
 * @api public
 */

exports.downvote = function downvote(id, citizen, fn) {
  Comment.findById(id, function(err, comment) {
    if (err) return log('Found error %s', err), fn(err);

    log('Downvoting comment %s', comment.id);
    comment.vote(citizen, 'negative', function(err) {
      if (err) return log('Found error %s', err), fn(err);

      log('Delivering comment %s', comment.id);
      fn(null, comment);
    });
  });
};

/**
 * Flag comment as spam
 *
 * @param {String} id
 * @param {Citizen|ObjectId|String} citizen
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'comment' list items found or `undefined`
 * @api public
 */

exports.flag = function flag(id, citizen, fn) {
  Comment.findById(id, function(err, comment) {
    if (err) return log('Found error %s', err), fn(err);

    log('Upvoting comment %s', comment.id);
    comment.flag(citizen, 'spam', function(err) {
      if (err) return log('Found error %s', err), fn(err);

      log('Delivering comment %s', comment.id);
      fn(null, comment);
    });
  });
};

/**
 * Unflag comment as spam
 *
 * @param {String} id
 * @param {Citizen|ObjectId|String} citizen
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'comments' list items found or `undefined`
 * @api public
 */

exports.unflag = function unflag(id, citizen, fn) {
  Comment.findById(id, function(err, comment) {
    if (err) return log('Found error %s', err), fn(err);

    log('Downvoting comment %s', comment.id);
    comment.unflag(citizen, function(err) {
      if (err) return log('Found error %s', err), fn(err);

      log('Delivering comment %s', comment.id);
      fn(null, comment);
    });
  });
};


/**
 * Edit comment
 *
 * @param {String} id
 * @param {Citizen|ObjectId|String} citizen
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 * @api public
 */

exports.edit = function edit(comment, fn) {
  log('Updating comment %s', comment.id);

  comment.save(function (err, comment) {
    if (!err) return log('Updated comment %s', comment.id), fn(null, comment);
    return log('Found error %s', err), fn(err);
  });

  return this;
};

/**
 * Remove comment
 *
 * @param {String} id
 * @param {Citizen|ObjectId|String} citizen
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 * @api public
 */

exports.remove = function remove(comment, fn) {
  comment.remove(function(err) {
    if (err) return log('Found error %s', err), fn(err);

    log('Comment %s removed', comment.id);
    fn(null);
  });
};
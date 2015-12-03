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
var config = require('lib/config');
var t = require('t-component');
var log = require('debug')('democracyos:db-api:comment');
var config = require('lib/config');
var utils = require('lib/utils');
var notifier = require('lib/notifications').notifier;
var User = require('lib/models').User;
var Topic = require('./topic');

var fields = 'id firstName lastName fullName email profilePictureUrl';

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
    fn(null, comments);
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
    User.populate(comment, { path: 'author' }, function(err) {
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

exports.getSideComments = function getSideComments (topicId, paging, fn) {
  log('Querying side comments for topic %s', topicId);
  paging = paging || {};

  Comment
    .find({ topicId: topicId, context: 'paragraph' })
    .sort(paging.sort || '-createdAt')
    .skip(paging.page * paging.limit)
    .limit(paging.limit)
    .exec(function (err, comments) {
      if (err) {
        log('Error querying side comments: %j', err);
        return fn(err);
      }

      var opts = { path: 'author', select: fields };

      User.populate(comments, opts, function(err, comments) {
        if (err) {
          log('Error populating users on side comments: %j', err);
          return fn(err);
        }

        log('Delivering comments %j', pluck(comments, 'id'));
        fn(null, comments);
      });
    });
};

exports.update = function get(query, values, fn) {
  Comment.update(query, values, { multi: true }, fn);
};

exports.getFor = function getFor(query, paging, fn) {
  log('Looking for comments for %s %s', query.context, query.reference);

  paging = paging || { page: 0, limit: config.commentsPerPage, sort: 'score', exclude_user: null };

  Comment
  .find(query)
  .sort(paging.sort || 'score')
  .skip(paging.page * paging.limit)
  .limit(paging.limit)
  .exec(function(err, comments) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    var opts = { path: 'author', select: fields };

    User.populate(comments, opts, function(err, comments) {
      if (err) {
        log('Found error %j', err);
        return fn(err);
      };

      log('Delivering comments %j', pluck(comments, 'id'));
      fn(null, comments);
    });
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
  .exec(function(err, comment) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    var opts = { path: 'replies.author', select: fields };

    User.populate(comment, opts, function(err, comment) {
      if (err) {
        log('Found error %j', err);
        return fn(err);
      };

      var replies = comment && comment.replies ? comment.replies : [];

      log('Delivering replies %j', pluck(replies, 'id'));
      fn(null, replies);
    });
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
        log('Found error %j', err);
        return fn(err);
      };

      var opts = { path: 'replies.author', select: fields };

      User.populate(comment, opts, function(err, comment) {
        if (err) {
          log('Found error %j', err);
          return fn(err);
        }

        if (comment.author != reply.author.id) {
          var eventName = 'comment-reply';
          var topicUrl = '';
          Topic.getWithForum(comment.reference, function(err, topic) {
            if (topic.forum) {
              topicUrl = utils.buildUrl(config, { pathname: '/' + topic.forum.name + '/topic/' + comment.reference });
            } else {
              topicUrl = utils.buildUrl(config, { pathname: '/topic/' + comment.reference });
            }

            var r = {
              id: doc.id,
              author: { id: reply.author.id },
              text: reply.text
            };

            var c = {
              id: comment.id,
              author: { id: comment.author }
            };

            notifier.notify(eventName)
              .to(reply.author.email)
              .withData({ reply: r, comment: c, url: topicUrl })
              .send(function (err, data) {
                if (err) {
                  log('Error when sending notification for event %s: %j', eventName, err);
                  return fn(err);
                }

                log('Delivering reply %s', doc.id);
                return fn(null, doc);
              });
          });
        } else {
          return fn(null, doc);
        }
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
 * @param {User|ObjectId|String} user
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'comment' list items found or `undefined`
 * @api public
 */

exports.upvote = function upvote(id, user, fn) {
  Comment.findById(id, function(err, comment) {
    if (err) return log('Found error %s', err), fn(err);

    User.populate(comment, { path: 'author' }, function (err, comment) {
      if (err) return log('Found error %s', err), fn(err);

      if (comment.author.id == user.id) {
        log('Author %s tried to vote their own comment %s', user.id, comment.id);
        return fn(t('comments.score.not-allowed'), comment);
      }

      log('Upvoting comment %s', comment.id);
      comment.vote(user, 'positive', function(err) {
        if (err) return log('Found error %s', err), fn(err);

        var eventName = 'comment-upvote';
        notifier.notify(eventName)
          .to(comment.author.email)
          .withData({ comment: comment, user: user })
          .send(function (err, data) {
            if (err) {
              log('Error when sending notification for event %s: %j', eventName, err);
              return fn(err);
            }

            log('Delivering comment %s', comment.id);
            fn(null, comment);
          });
      });
    });
  });
};

/**
 * Downvote comment
 *
 * @param {String} id
 * @param {User|ObjectId|String} user
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'comments' list items found or `undefined`
 * @api public
 */

exports.downvote = function downvote(id, user, fn) {
  Comment.findById(id, function(err, comment) {
    if (err) return log('Found error %s', err), fn(err);

    User.populate(comment, { path: 'author' }, function (err, comment) {
      if (err) return log('Found error %s', err), fn(err);

      if (comment.author.id == user.id) {
        log('Author %s tried to vote their own comment %s', user.id, comment.id);
        return fn(t('comments.score.not-allowed'), comment);
      }

      log('Downvoting comment %s', comment.id);
      comment.vote(user, 'negative', function(err) {
        if (err) return log('Found error %s', err), fn(err);

        var eventName = 'comment-downvote';
        notifier.notify(eventName)
          .to(comment.author.email)
          .withData({ comment: comment, user: user })
          .send(function (err, data) {
            if (err) {
              log('Error when sending notification for event %s: %j', eventName, err);
              return fn(err);
            }

            log('Delivering comment %s', comment.id);
            fn(null, comment);
          });
      });
    });
  });
};


/**
 * Remove votation positive/negative from some comment.
 *
 * @param {String} id Comment id.
 * @param {Function} fn Callback function
 * @param {User} user The voe user
 */
exports.unvote = function (id, user, fn) {
  Comment.findById(id, function (err, comment) {

    if (err) {
      log('Found error %s', err);
      return fn(err);
    }

    User.populate(comment, { path: 'author' }, function (err, comment) {
      if (err) {
        log('Found error %s', err);
        return fn(err);
      }

      log('Remove vote from comment %s',comment.id);

      comment.unvote(user, function (err) {
        if (err) {
          log('Found error %s', err);
          return fn(err);
        }
        log('Delivering unvoted comment %s', comment.id);
        fn(null, comment);
      });
    });
  });
};

/**
 * Flag comment as spam
 *
 * @param {String} id
 * @param {User|ObjectId|String} user
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'comment' list items found or `undefined`
 * @api public
 */

exports.flag = function flag(id, user, fn) {
  Comment.findById(id, function(err, comment) {
    if (err) return log('Found error %s', err), fn(err);

    log('Upvoting comment %s', comment.id);
    comment.flag(user, 'spam', function(err) {
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
 * @param {User|ObjectId|String} user
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'comments' list items found or `undefined`
 * @api public
 */

exports.unflag = function unflag(id, user, fn) {
  Comment.findById(id, function(err, comment) {
    if (err) return log('Found error %s', err), fn(err);

    log('Downvoting comment %s', comment.id);
    comment.unflag(user, function(err) {
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
 * @param {User|ObjectId|String} user
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
 * @param {User|ObjectId|String} user
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

/**
 * Search comment ratings
 *
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'ratings', total rated comments or `undefined`
 * @return {Module} `topic` module
 * @api public
 */

exports.ratings = function ratings(fn) {
  log('Counting total rated comments');

  Comment
    .aggregate(
      { $unwind : "$votes" },
      { $group: { _id: "#votes", total: { $sum: 1 } } },
      function (err, res) {
        if (err) {
          log('Found error: %j', err);
          return fn(err);
        }

        if (!res[0]) return fn(null, 0);

        var rated = res[0].total;

        log('Found %d rated comments', rated);
        fn(null, rated);
      }
    );

  return this;
};

/**
 * Total replies
 *
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'replies', total comment replies or `undefined`
 * @return {Module} `topic` module
 * @api public
 */

exports.totalReplies = function totalReplies(fn) {
  log('Counting total comment replies');

  Comment
    .aggregate(
      { $unwind : "$replies" },
      { $group: { _id: "#replies", total: { $sum: 1 } } },
      function (err, res) {
        if (err) {
          log('Found error: %j', err);
          return fn(err);
        }

        if (!res[0]) return fn(null, 0);

        var replies = res[0].total;

        log('Found %d comment replies', replies);
        fn(null, replies);
      }
    )

  return this;
};
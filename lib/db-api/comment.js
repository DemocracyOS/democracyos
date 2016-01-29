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

exports.all = function all (fn) {
  log('Looking for all comments.');

  Comment.find(function (err, comments) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    }

    log('Delivering comments %j', pluck(comments, 'id'));
    fn(null, comments);
  });

  return this;
};

/**
 * Get all comments
 *
 * @param {ObjectId} id comment id
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'comments' list items found or `undefined`
 * @return {Module} `comment` module
 * @api public
 */

exports.getById = function getById (id, fn) {
  return Comment.findById(id, fn);
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

exports.create = function create (comment, fn) {
  log('Creating new comment %j for %s %s', comment.text, comment.context, comment.reference);

  comment = new Comment(comment);

  comment.save(function (err) {
    if (err) {
      log('Found error %s', err);
      return fn(err);
    }

    User.populate(comment, { path: 'author' }, function (populateErr) {
      if (populateErr) {
        log('Found error %s', populateErr);
        return fn(populateErr);
      }

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

      User.populate(comments, opts, function (_err, _comments) {
        if (_err) {
          log('Error populating users on side comments: %j', _err);
          return fn(_err);
        }

        log('Delivering comments %j', pluck(_comments, 'id'));
        fn(null, _comments);
      });
    });
};

exports.update = function get (query, values, fn) {
  Comment.update(query, values, { multi: true }, fn);
};

exports.getFor = function getFor (query, paging, fn) {
  log('Looking for comments for %s %s', query.context, query.reference);

  paging = paging || {
    page: 0,
    limit: config.commentsPerPage,
    sort: 'score',
    exclude_user: null
  };

  Comment
  .find(query)
  .sort(paging.sort || 'score')
  .skip(paging.page * paging.limit)
  .limit(paging.limit)
  .exec(function(err, comments) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    }

    var opts = { path: 'author', select: fields };

    User.populate(comments, opts, function(_err, _comments) {
      if (_err) {
        log('Found error %j', _err);
        return fn(_err);
      }

      log('Delivering comments %j', pluck(_comments, 'id'));
      fn(null, _comments);
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

exports.replies = function replies (id, fn) {
  log('Looking for replies for comment %s', id);

  Comment
  .findOne({ _id: id })
  .exec(function(err, comment) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    }

    var opts = { path: 'replies.author', select: fields };

    User.populate(comment, opts, function (_err, _comment) {
      if (_err) {
        log('Found error %j', _err);
        return fn(_err);
      }

      var _replies = _comment && _comment.replies ? _comment.replies : [];

      log('Delivering replies %j', pluck(_replies, 'id'));
      fn(null, _replies);
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

exports.reply = function reply (commentId, _reply, fn) {
  log('Looking for comment %s to reply with %j', commentId, _reply);

  Comment.findById(commentId, function(err, comment) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    }

    log('Creating reply %j for comment %j', _reply, comment);
    var doc = comment.replies.create(_reply);
    comment.replies.push(doc);

    comment.save(function (saveErr) {

      if (saveErr) {
        log('Found error %j', saveErr);
        return fn(saveErr);
      }

      var opts = { path: 'replies.author', select: fields };

      User.populate(comment, opts, function (populatedErr, populatedComment) {
        if (populatedErr) {
          log('Found error %j', populatedErr);
          return fn(populatedErr);
        }

        if (populatedComment.author != _reply.author.id) {
          var eventName = 'comment-reply';
          var topicUrl = '';
          Topic.getWithForum(populatedComment.reference, function (queryErr, topic) {
            if (topic.forum) {
              topicUrl = utils.buildUrl(config, { pathname: '/' + topic.forum.name + '/topic/' + populatedComment.reference });
            } else {
              topicUrl = utils.buildUrl(config, { pathname: '/topic/' + populatedComment.reference });
            }

            var r = {
              id: doc.id,
              author: { id: _reply.author.id },
              text: _reply.text
            };

            var c = {
              id: populatedComment.id,
              author: { id: populatedComment.author }
            };

            notifier.notify(eventName)
              .to(_reply.author.email)
              .withData({ reply: r, comment: c, url: topicUrl })
              .send(function (notifyErr) {
                if (notifyErr) {
                  log('Error when sending notification for event %s: %j', eventName, notifyErr);
                  return fn(notifyErr);
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

exports.editReply = function editReply (comment, reply, fn) {
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
    }
  );
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

exports.upvote = function upvote (id, user, fn) {
  Comment.findById(id, function(findErr, comment) {
    if (findErr) {
      log('Found error %s', findErr);
      return fn(findErr);
    }

    User.populate(comment, { path: 'author' }, function (populateErr, populatedComment) {
      if (populateErr) {
        log('Found error %s', populateErr);
        return fn(populateErr);
      }

      if (populatedComment.author.id == user.id) {
        log('Author %s tried to vote their own comment %s', user.id, populatedComment.id);
        return fn(t('comments.score.not-allowed'), populatedComment);
      }

      log('Upvoting comment %s', comment.id);
      populatedComment.vote(user, 'positive', function(err) {
        if (err) {
          log('Found error %s', err);
          return fn(err);
        }

        var eventName = 'comment-upvote';
        notifier.notify(eventName)
          .to(populatedComment.author.email)
          .withData({ comment: populatedComment, user: user })
          .send(function (notifyErr) {
            if (notifyErr) {
              log('Error when sending notification for event %s: %j', eventName, notifyErr);
              return fn(notifyErr);
            }

            log('Delivering comment %s', populatedComment.id);
            fn(null, populatedComment);
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

exports.downvote = function downvote (id, user, fn) {
  Comment.findById(id, function (findErr, comment) {
    if (findErr) {
      log('Found error %s', findErr);
      return fn(findErr);
    }

    User.populate(comment, { path: 'author' }, function (populateErr, populatedComment) {
      if (populateErr) {
        log('Found error %s', populateErr);
        return fn(populateErr);
      }

      if (populatedComment.author.id == user.id) {
        log('Author %s tried to vote their own comment %s', user.id, populatedComment.id);
        return fn(t('comments.score.not-allowed'), populatedComment);
      }

      log('Downvoting comment %s', populatedComment.id);
      populatedComment.vote(user, 'negative', function (voteErr) {
        if (voteErr) {
          log('Found error %s', voteErr);
          return fn(voteErr);
        }

        var eventName = 'comment-downvote';
        notifier.notify(eventName)
          .to(populatedComment.author.email)
          .withData({ comment: populatedComment, user: user })
          .send(function (notifyErr) {
            if (notifyErr) {
              log('Error when sending notification for event %s: %j', eventName, notifyErr);
              return fn(notifyErr);
            }

            log('Delivering comment %s', populatedComment.id);
            fn(null, populatedComment);
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
exports.unvote = function unvote (id, user, fn) {
  Comment.findById(id, function (err, comment) {

    if (err) {
      log('Found error %s', err);
      return fn(err);
    }

    User.populate(comment, { path: 'author' }, function (populateErr, populatedComment) {
      if (populateErr) {
        log('Found error %s', populateErr);
        return fn(populateErr);
      }

      log('Remove vote from comment %s', populatedComment.id);

      populatedComment.unvote(user, function (unvoteErr) {
        if (unvoteErr) {
          log('Found error %s', unvoteErr);
          return fn(unvoteErr);
        }

        log('Delivering unvoted comment %s', populatedComment.id);
        fn(null, populatedComment);
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

exports.flag = function flag (id, user, fn) {
  Comment.findById(id, function (err, comment) {
    if (err) {
      log('Found error %s', err);
      return fn(err);
    }

    log('Upvoting comment %s', comment.id);

    comment.flag(user, 'spam', function (flagErr) {
      if (flagErr) {
        log('Found error %s', flagErr);
        return fn(flagErr);
      }

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

exports.unflag = function unflag (id, user, fn) {
  Comment.findById(id, function(err, comment) {
    if (err) {
      log('Found error %s', err);
      return fn(err);
    }

    log('Downvoting comment %s', comment.id);
    comment.unflag(user, function (unflagErr) {
      if (unflagErr) {
        log('Found error %s', unflagErr);
        return fn(unflagErr);
      }

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

exports.edit = function edit (comment, fn) {
  log('Updating comment %s', comment.id);

  comment.save(function (err) {
    if (err) {
      log('Found error %s', err);
      return fn(err);
    }

    log('Updated comment %s', comment.id);
    fn(null, comment);
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

exports.remove = function remove (comment, fn) {
  comment.remove(function(err) {
    if (err) {
      log('Found error %s', err);
      return fn(err);
    }

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

exports.ratings = function ratings (fn) {
  log('Counting total rated comments');

  Comment
    .aggregate(
      {$unwind: '$votes'},
      {$group: { _id: '#votes', total: {$sum: 1}}},
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

exports.totalReplies = function totalReplies (fn) {
  log('Counting total comment replies');

  Comment.aggregate(
    {$unwind: '$replies' },
    {$group: {_id: '#replies', total: {$sum: 1}}},
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
  );

  return this;
};

/**
 * Extend module's NODE_PATH
 * HACK: temporary solution
 */

require('node-path')(module);

/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Topic = mongoose.model('Topic');
var commentApi = require('./comment');
var tagApi = require('./tag');
var utils = require('lib/utils');
var pluck = utils.pluck;
var log = require('debug')('democracyos:db-api:topic');

/**
 * Get all topics
 *
 * @param {Function} fn callback function
 *   - 'err' error found on query or `null`
 *   - 'topics' list items found or `undefined`
 * @return {Module} `topic` module
 * @api public
 */

exports.all = function all(forum, fn) {
  log('Looking for all topics.')

  var query = { deletedAt: null };
  if (forum) query.forum = forum;

  Topic
  .find(query)
  .select('id topicId mediaTitle tag participants votes createdAt updatedAt closingAt publishedAt deletedAt status open closed links author authorUrl')
  .populate('tag', 'id hash name color image')
  .exec(function (err, topics) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    }

    log('Delivering topics %j', pluck(topics, 'id'));
    fn(null, topics);
  });

  return this;
};

/**
 * Search topics from query
 *
 * @param {Object} query filter
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'topics' list of topics objects found or `undefined`
 * @return {Module} `topic` module
 * @api public
 */

exports.search = function search(query, fn) {
  log('Searching for topics matching %j', query);

  Topic
    .find(query, function(err, topics) {
    if (err) {
      log('Found error: %j', err);
      return fn(err);
    }

    log('Found topics %j for %j', pluck(topics, 'id'), query);
    fn(null, topics);
  });

  return this;
};

/**
 * Creates topic
 *
 * @param {Object} data to create topic
 * @param {Function} fn callback function
 *   - 'err' error found on query or `null`
 *   - 'topic' item created or `undefined`
 * @return {Module} `topic` module
 * @api public
 */

exports.create = function create(data, fn) {
  log('Creating new topic %j', data);
  ensureTag(data, function(err, data) {
    if (err) return log('Found error from topic creation: %s', err.message), fn(err);
    createTopic(data, fn);
  });

  return this;
};

function ensureTag(data, fn) {
  tagApi.searchOne(data.hash, function(err, tags) {
    if (err) return log('Found error %s', err.message), fn(err);

    if (!tags.length) {
      if (!data.tag) return fn(new Error('No tag provided'));
      tagApi.create(data.tag, function(err, tag) {
        if (err) return log('Found error from tag creation: %s', err.message), fn(err);
        data.tag = tag;
        fn(null, data);
      });
    } else {
      fn(null, data);
    }
  });
};

function createTopic(data, fn) {
  var topic = new Topic(data);
  topic.save(onsave);

  function onsave(err) {
    if (err) return log('Found error %s', err), fn(err);

    log('Saved topic %s', topic.id);
    fn(null, topic);
  }
};

/**
 * Update topic by `id` and `data`
 *
 * @param {ObjectId|String} data to create topic
 * @param {Function} fn callback function
 *   - 'err' error found on query or `null`
 *   - 'topic' item created or `undefined`
 * @return {Module} `topic` module
 * @api public
 */

exports.update = function update(id, data, fn) {
  log('Updating topic %s with %j', id, data);

  // look for tag for nesting reference
  log('Looking for tag %s in database.', data.tag);
  tagApi.searchOne(data.tag, function (err, tag) {
    if (err) return log('Found error %s', err.message), fn(err);

    // now set `data.tag` to `tag`'s document _id
    data.tag = tag;

    // get topic
    exports.get(id, onget);

    function onget(err, topic) {
      if (err) {
        log('Found error %s', err.message);
        return fn(err);
      };

      var clauses = data.clauses || [];
      delete data.clauses;

      clauses.forEach(function(clause) {
        var c = topic.clauses.id(clause.id);
        // c.update(clause);
        clause.centered = !!clause.centered;
        c.set(clause);
      });

      var links = data.links || [];
      delete data.links;

      links.forEach(function(link) {
        var l = topic.links.id(link.id);
        l.set(link);
      });

      // update and save topic document with data
      topic.set(data);
      topic.save(onupdate);
    }

    function onupdate(err, topic) {
      if (!err) return log('Saved topic %s', topic.id), fn(null, topic);
      return log('Found error %s', err), fn(err);
    }

  });

  return this;
};

/**
 * Search single topic from _id
 *
 * @param {ObjectId} topic Id to search by `_id`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'topic' single topic object found or `undefined`
 * @return {Module} `topic` module
 * @api public
 */

exports.searchOne = function searchByTopicId(id, fn) {
  var query = { _id: id, deletedAt: null };

  log('Searching for single topic matching %j', query);
  Topic
  .findOne(query)
  .populate('tag')
  .populate('participants')
  .exec(function (err, topic) {
    if (err) {
      log('Found error %s', err);
      return fn(err);
    }

    if (!topic) {
      log('Topic with id %s not found.', id);
      return fn(new Error('Topic not found'));
    }

    log('Delivering topic %s', topic.id);
    fn(null, topic);
  });

  return this;
};

/**
 * Get Topic form `id` string or `ObjectId`
 *
 * @param {String|ObjectId} id Topic's `id`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'topic' found item or `undefined`
 * @api public
 */

exports.get = function get(id, fn) {
  var query = { _id: id, deletedAt: null };

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    log('ObjectId %s is not valid', id);
    return fn(null);
  }

  log('Looking for topic %s', id);
  Topic
  .findOne(query)
  .populate('tag')
  .exec(function (err, topic) {
    if (err) {
      log('Found error %s', err);
      return fn(err);
    };

    if (!topic) {
      log('Topic %s not found', id);
      return fn(null);
    }
    log('Delivering topic %s', topic.id);
    fn(null, topic);
  });
};

/**
 * Vote topic
 *
 * @param {String} id Topic `id`
 * @param {String} user author of the vote
 * @param {String} value `positive` or `negative` or `neutral`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'proposal' single object created or `undefined`
 * @api public
 */

exports.vote = function vote(id, user, value, fn) {
  var query = { _id: id, deletedAt: null };

  log('Proceding to vote %s at topic %s by user %s', value, id, user.id || user);
  Topic
  .findOne(query)
  .exec(function (err, topic) {
    if (err) {
      log('Found error %s', err);
      return fn(err);
    };

    topic.vote(user.id, value, function(err) {
      if (err) {
        log('Found error %s', err);
        return fn(err);
      };

      log('Voted %s at topic %s by user %s', value, id, user.id || user);
      fn(null, topic);
    });
  });
};

/*
 * Recount topic votes and process delegations
 *
 * @param {String} id Topic `id`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'proposal' single object created or `undefined`
 * @api public
 */

exports.recount = function vote(id, fn) {
  // var query = { _id: id, deletedAt: null };
  // log('Proceding to recount %s', id);

  // Topic
  // .findOne(query)
  // .exec(function (err, topic) {
  //   if (err) {
  //     log('Found error %s', err);
  //     return fn(err);
  //   };

  //   if ('recount' === topic.status) {
  //     log('Called recount but recount has already started.');
  //     return fn(new Error('Recount already started.'));
  //   };

  //   if ('closed' === topic.status) {
  //     log('Called recount but topic vote cast is closed.');
  //     return fn(new Error('Vote cast closed for topic.'));
  //   };

  //   // Mark topic for recount
  //   topic.recount(function(err) {
  //     if (err) {
  //       log('Found error %s', err);
  //       return fn(err);
  //     };

  //     // WRONG
  //     delegationApi.trees(pluck(topic.votes, 'author'), function(trees) {
  //       var nodes = trees.map(function(t) { return t.nodes() })

  //       nodes.forEach(function(n) {
  //         // node value
  //         var author = n.truster;
  //         // node parent
  //         var trustee = n.trustee;
  //         // node's branch top node
  //         var caster = n.caster;

  //         topic.proxyVote(author, trustee, caster);
  //       });

  //       topic.save(function(err) {
  //         if (err) {
  //           log('Found err %s', err);
  //           return fn(err);
  //         };

  //         fn(null, topic);
  //       });
  //     });
  //   });
  // });
};

/**
 * Direct comment to topic
 *
 * @param {String} id Proposal's `id`
 * @param {Object} comment to attach
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'topic' single object created or `undefined`
 * @api public
 */

exports.comment = function comment(comment, fn) {
  log('Creating comment %j for topic %s', comment.text, comment.reference);
  commentApi.create(comment, function (err, commentDoc) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering comment %j', commentDoc);
    fn(null, commentDoc);
  });
};

/**
 * Get comments for topic
 *
 * @param {String} id Topic's `id`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'topic' single object created or `undefined`
 * @api public
 */

exports.comments = function comments(id, paging, fn) {
  log('Get comments for topic %s', id);

  var query = {
    $or: [
      { context: 'topic', reference: id },
      { context: 'topic', reference: mongoose.Types.ObjectId(id) }
    ]
  };

  if (paging.exclude_user) {
    query['author'] = { $ne: paging.exclude_user };
  }
  commentApi.getFor(query, paging
   , function (err, comments) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering comments %j', pluck(comments, 'id'));
    fn(null, comments);
  });
};

/**
 * Get comments for topic
 *
 * @param {String} id Topic's `id`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'topic' single object created or `undefined`
 * @api public
 */

exports.userComments = function userComments(id, userId, fn) {
  log('Get comments for topic %s from user %s', id, userId);

  var query = {
    context: 'topic',
    $or: [
      { context: 'topic', reference: id },
      { context: 'topic', reference: mongoose.Types.ObjectId(id) }
    ],
    author: userId
  };

  var paging = { limit: 0, sort: 'createdAt' };

  commentApi.getFor(query, paging, function (err, comments) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering comments %j from user %s', pluck(comments, 'id'), userId);
    fn(null, comments);
  });
};

/**
 * Get topics for RSS feed
 *
 * @param {Function} fn callback function
 *   - 'err' error found on query or `null`
 *   - 'topics' list items found or `undefined`
 * @return {Module} `topic` module
 * @api public
 */

exports.rss = function all(fn) {
  log('Looking for RSS feed topics.')

  Topic
  .find({ deletedAt: null })
  .select('id topicId mediaTitle publishedAt summary')
  .exec(function (err, topics) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering topics %j', pluck(topics, 'id'));
    fn(null, topics);
  });

  return this;
};

/**
 * Search total votes
 *
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'votes', total casted or `undefined`
 * @return {Module} `topic` module
 * @api public
 */

exports.votes = function votes(fn) {
  log('Counting total casted votes');

  Topic
    .aggregate(
      { $unwind : "$votes" },
      { $group: { _id: "#votes", total: { $sum: 1 } } },
      function (err, res) {
        if (err) {
          log('Found error: %j', err);
          return fn(err);
        }

        if (!res[0]) return fn(null, 0);

        var votes = res[0].total;

        log('Found %d casted votes', votes);
        fn(null, votes);
      }
    );

  return this;
};

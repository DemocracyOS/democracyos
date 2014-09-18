/**
 * Extend module's NODE_PATH
 * HACK: temporary solution
 */

require('node-path')(module);

/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Law = mongoose.model('Law');
var commentApi = require('./comment');
var delegationApi = require('./delegation');
var tagApi = require('./tag');
var utils = require('lib/utils');
var pluck = utils.pluck;
var log = require('debug')('democracyos:db-api:law');

/**
 * Get all laws
 *
 * @param {Function} fn callback function
 *   - 'err' error found on query or `null`
 *   - 'laws' list items found or `undefined`
 * @return {Module} `law` module
 * @api public
 */

exports.all = function all(fn) {
  log('Looking for all laws.')

  Law
  .find({ deletedAt: null })
  .select('id lawId mediaTitle tag participants votes createdAt updatedAt closingAt publishedAt deletedAt status open closed links author authorUrl')
  .populate('tag', 'id hash name color image')
  .exec(function (err, laws) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering laws %j', pluck(laws, 'id'));
    fn(null, laws);
  });

  return this;
};

/**
 * Search laws from query
 *
 * @param {Object} query filter
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'laws' list of laws objects found or `undefined`
 * @return {Module} `law` module
 * @api public
 */

exports.search = function search(query, fn) {
  log('Searching for laws matching %j', query);

  Law
    .find(query, function(err, laws) {
    if (err) {
      log('Found error: %j', err);
      return fn(err);
    }

    log('Found laws %j for %j', pluck(laws, 'id'), query);
    fn(null, laws);
  });

  return this;
};

/**
 * Creates law
 *
 * @param {Object} data to create law
 * @param {Function} fn callback function
 *   - 'err' error found on query or `null`
 *   - 'law' item created or `undefined`
 * @return {Module} `law` module
 * @api public
 */

exports.create = function create(data, fn) {
  log('Creating new law %j', data);

  // wrong using tag api within proposal's
  log('Looking for tag %s in database.', data.tag);
  tagApi.create(data.tag, function (err, tag) {
    if (err) {
      log('Found error from tag creation %j', err);
      return fn(err);
    };

    data.tag = tag;

    var law = new Law(data);

    law.save(onsave);

    function onsave(err) {
      if (!err) return log('Saved law %s', law.id), fn(null, law);

      if (11000 == err.code) {
        log('Attempt of duplication');
        exports.searchOne(law.lawId, fn);
      } else {
        log('Found error %s', err);
        fn(err);
      }

    }

  });

  return this;
};

/**
 * Update law by `id` and `data`
 *
 * @param {ObjectId|String} data to create law
 * @param {Function} fn callback function
 *   - 'err' error found on query or `null`
 *   - 'law' item created or `undefined`
 * @return {Module} `law` module
 * @api public
 */

exports.update = function update(id, data, fn) {
  log('Updating law %s with %j', id, data);

  // look for tag for nesting reference
  log('Looking for tag %s in database.', data.tag);
  tagApi.searchOne(data.tag, function (err, tag) {
    if (err) return log('Found error %s', err.message), fn(err);

    // now set `data.tag` to `tag`'s document _id
    data.tag = tag;

    // get law
    exports.get(id, onget);

    function onget(err, law) {
      if (err) {
        log('Found error %s', err.message);
        return fn(err);
      };

      var clauses = data.clauses || [];
      delete data.clauses;

      clauses.forEach(function(clause) {
        var c = law.clauses.id(clause.id);
        // c.update(clause);
        clause.centered = !!clause.centered;
        c.set(clause);
      });

      var links = data.links || [];
      delete data.links;

      links.forEach(function(link) {
        var l = law.links.id(link.id);
        l.set(link);
      });

      // update and save law document with data
      law.set(data);
      law.save(onupdate);
    }

    function onupdate(err, law) {
      if (!err) return log('Saved law %s', law.id), fn(null, law);
      return log('Found error %s', err), fn(err);
    }

  });

  return this;
};

/**
 * Search single law from lawId
 *
 * @param {String} lawId string to search by `lawId`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'law' single law object found or `undefined`
 * @return {Module} `law` module
 * @api public
 */

exports.searchOne = function searchByLawId(lawId, fn) {
  var query = { lawId: lawId, deletedAt: null };

  log('Searching for single law matching %j', query);
  Law
  .findOne(query)
  .populate('tag')
  .populate('participants')
  .exec(function (err, law) {
    if (err) {
      log('Found error %s', err);
      return fn(err);
    }

    log('Delivering law %s', law.id);
    fn(null, law);
  })

  return this;
};

/**
 * Get Law form `id` string or `ObjectId`
 *
 * @param {String|ObjectId} id Law's `id`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'law' found item or `undefined`
 * @api public
 */

exports.get = function get(id, fn) {
  var query = { _id: id, deletedAt: null };

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    log('ObjectId %s is not valid', id);
    return fn(null);
  }

  log('Looking for law %s', id);
  Law
  .findOne(query)
  .populate('tag')
  .exec(function (err, law) {
    if (err) {
      log('Found error %s', err);
      return fn(err);
    };

    if (!law) {
      log('Law %s not found', id);
      return fn(null);
    }
    log('Delivering law %s', law.id);
    fn(null, law);
  });
};

/**
 * Vote law
 *
 * @param {String} id Law `id`
 * @param {String} citizen author of the vote
 * @param {String} value `positive` or `negative` or `neutral`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'proposal' single object created or `undefined`
 * @api public
 */

exports.vote = function vote(id, citizen, value, fn) {
  var query = { _id: id, deletedAt: null };

  log('Proceding to vote %s at law %s by citizen %s', value, id, citizen.id || citizen);
  Law
  .findOne(query)
  .exec(function (err, law) {
    if (err) {
      log('Found error %s', err);
      return fn(err);
    };

    law.vote(citizen.id, value, function(err) {
      if (err) {
        log('Found error %s', err);
        return fn(err);
      };

      log('Voted %s at law %s by citizen %s', value, id, citizen.id || citizen);
      fn(null, law);
    });
  });
};

/*
 * Recount law votes and process delegations
 *
 * @param {String} id Law `id`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'proposal' single object created or `undefined`
 * @api public
 */

exports.recount = function vote(id, fn) {
  var query = { _id: id, deletedAt: null };
  log('Proceding to recount %s', id);

  Law
  .findOne(query)
  .exec(function (err, law) {
    if (err) {
      log('Found error %s', err);
      return fn(err);
    };

    if ('recount' === law.status) {
      log('Called recount but recount has already started.');
      return fn(new Error('Recount already started.'));
    };

    if ('closed' === law.status) {
      log('Called recount but law vote cast is closed.');
      return fn(new Error('Vote cast closed for law.'));
    };

    // Mark law for recount
    law.recount(function(err) {
      if (err) {
        log('Found error %s', err);
        return fn(err);
      };

      // WRONG
      delegationApi.trees(pluck(law.votes, 'author'), function(trees) {
        var nodes = trees.map(function(t) { return t.nodes() })

        nodes.forEach(function(n) {
          // node value
          var author = n.truster;
          // node parent
          var trustee = n.trustee;
          // node's branch top node
          var caster = n.caster;

          law.proxyVote(author, trustee, caster);
        });

        law.save(function(err) {
          if (err) {
            log('Found err %s', err);
            return fn(err);
          };

          fn(null, law);
        });
      });
    });
  });
};

/**
 * Direct comment to law
 *
 * @param {String} id Proposal's `id`
 * @param {Object} comment to attach
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'law' single object created or `undefined`
 * @api public
 */

exports.comment = function comment(comment, fn) {
  log('Creating comment %j for law %s', comment.text, comment.reference);
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
 * Get comments for law
 *
 * @param {String} id Law's `id`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'law' single object created or `undefined`
 * @api public
 */

exports.comments = function comments(id, paging, fn) {
  log('Get comments for law %s', id);
  
  var query = {
    context: 'law',
    reference: id
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
 * Get comments for law
 *
 * @param {String} id Law's `id`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'law' single object created or `undefined`
 * @api public
 */

exports.citizenComments = function citizenComments(id, citizenId, fn) {
  log('Get comments for law %s from citizen %s', id, citizenId);

  var query = {
    context: 'law',
    reference: id,
    author: citizenId
  };

  var paging = { limit: 0, sort: 'createdAt' };

  commentApi.getFor(query, paging, function (err, comments) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering comments %j from citizen %s', pluck(comments, 'id'), citizenId);
    fn(null, comments);
  });
};

/**
 * Get laws for RSS feed
 *
 * @param {Function} fn callback function
 *   - 'err' error found on query or `null`
 *   - 'laws' list items found or `undefined`
 * @return {Module} `law` module
 * @api public
 */

exports.rss = function all(fn) {
  log('Looking for RSS feed laws.')

  Law
  .find({ deletedAt: null })
  .select('id lawId mediaTitle publishedAt summary')
  .exec(function (err, laws) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering laws %j', pluck(laws, 'id'));
    fn(null, laws);
  });

  return this;
};

/**
 * Search total votes
 *
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'votes', total casted or `undefined`
 * @return {Module} `law` module
 * @api public
 */

exports.votes = function votes(fn) {
  log('Counting total casted votes');

  Law
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
/**
 * Module dependencies.
 */

var config = require('lib/config');
var mongoose = require('mongoose');
var Tag = require('lib/models').Tag;
var Feed = require('lib/models').Feed;
var Comment = require('lib/models').Comment;
var Forum = require('lib/models').Forum;
var User = require('lib/models').User;
var log = require('debug')('democracyos:db-api:feed');

exports.all = function all(page, fn) {
  log('Looking for all feeds');

  var page = page || 0;
  var limit = config.feedsLimit || null;

  Feed
  .find()
  .populate('topic comment')
  .sort('-feededAt')
  .skip(page * limit)
  .limit(limit)
  .exec(function(err, feeds) {
    if (err) {
      log('Found error: %s', err);
      return fn(err);
    }

    Tag.populate(feeds, { path: 'topic.tag' }, function (err, feeds) {
      if (err) return log('Found error: populating feed user %s', err), fn(err);

      log('Populated user on feeds %j', feeds);

      User.populate(feeds, { path: 'data.user' }, function (err, feeds) {
        if (err) return log('Found error: populating feed user %s', err), fn(err);

        log('Populated user on feeds %j', feeds);

        Forum.populate(feeds, { path: 'topic.forum' }, function (err, feeds) {
          log('Populated forum on feeds %j', feeds);
          fn(null, feeds);
        });
      });
    });
  });

  return this;
};

exports.remove = function remove(query, fn) {
  Feed.remove(query, fn);
};

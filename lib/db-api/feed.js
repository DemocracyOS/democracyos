/**
 * Module dependencies.
 */

var config = require('lib/config');
var mongoose = require('mongoose');
var Feed = require('lib/models').Feed;
var User = require('lib/models').User;
var log = require('debug')('democracyos:db-api:feed');

exports.all = function all(page, fn) {
  log('Looking for all feeds');

  var page = page || 0;
  var limit = config.feedsLimit || null;

  Feed
  .find()
  .select('id type forum law data createdAt')
  .populate('forum')
  .populate('law')
  .sort('-feededAt')
  .skip(page * limit)
  .limit(limit)
  .exec(function(err, feeds) {
    if (err) {
      log('Found error: %s', err);
      return fn(err);
    }

    User.populate(feeds, { path: 'data.user' }, function (err, feeds) {
      if (err) return log('Found error: populating feed user %s', err), fn(err);

      log('Populated user on feeds %j', feeds);
      fn(null, feeds);
    })
  });

  return this;
};
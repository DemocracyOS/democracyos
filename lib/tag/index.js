/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Tag = mongoose.model('Tag')
  , log = require('debug')('tag');


exports.all = function all (fn) {
  log('Looking for all tags.');

  Tag.find(function (err, tags) {
    if (err) {
      log('Found error %j')
      return fn(err);
    }

    log('Delivering tags %j', tags.map(function(tag) { return tag.id; }))
    fn(null, tags);
  });
};

exports.search = function search (query, fn) {
  var hashQuery = new RegExp(".*" + query + ".*","i");

  log('Searching for tags matching %s', hashQuery);
  Tag.find({ hash: hashQuery }, function(err, tags) {
    if (err) {
      log('Found error: %j', err);
      return fn(err);
    }

    log('Found tags %j for %s', tags, hashQuery)
    fn(null, tags);
  });
};

exports.searchOne = function searchOne (query, fn) {
  var hashQuery = new RegExp(query, 'i');

  log('Searching for single tag matching %s', hashQuery);
  Tag.findOne({ hash: hashQuery }, function (err, tag) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    }

    log('Delivering tag %j', tag);
    fn(null, tag);
  })
};

exports.get = function get (id, fn) {
  log('Looking for tag %j', id)
  Tag.findById(id, function (err, tag) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    }

    log('Delivering tag %j', tag);
    fn(null, tag)
  })
};

exports.create = function create (tag, fn) {
  log('Creating new tag %j', tag);

  if ('string' !== typeof tag.hash) {
    log('Delivering validation error.');

    var errMsg = 'Tag hash should be string. '
      + typeof tag.hash
      + ' provided.';

    var err = {};
    err.message = errMsg;
    err.name = 'Validation error.';

    return fn(err);
  };

  (new Tag(tag)).save(function (err, saved) {
    if (err) {
      if (11000 == err.code) {
        log('Attempt duplication.');
        exports.searchOne(tag.hash, fn);
      } else {
        log('Found error %j', err);
        fn(err);
      }

      return;
    };

    log('Delivering tag %j', saved);
    fn(null, saved);
  });
};

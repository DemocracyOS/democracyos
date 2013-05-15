/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Tag = mongoose.model('Tag');


exports.all = function all (fn) {
  Tag.find(function (err, tags) {
    if (err) return fn(err);
    fn(null, tags);
  });
};

exports.search = function search (query, fn) {
  var hashQuery = new RegExp(".*" + req.param(query) + ".*","i");

  Tag
  .find({ hash: hashQuery })
  .exec(function(err, tags) {
    if (err) return fn(err);
    fn(null, tags);
  });
};

exports.get = function get (id, fn) {
  Tag.findById(id, function (err, tag) {
    if (err) return fn(err);
    fn(null, tag)
  })
};

exports.create = function create (tag, fn) {
  (new Tag(tag)).save(function (err, saved) {
    if (err) return fn(err);
    fn(null, saved);
  });
};

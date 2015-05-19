/**
 * Module dependencies.
 */

var api = require('lib/db-api');
var express = require('express');
var utils = require('lib/utils');
var expose = utils.expose;
var pluck = utils.pluck;
var log = require('debug')('hub:feed-api');

var app = module.exports = express();

app.get('/feeds/all', function (req, res) {
  log('Request /feeds/all');

  api.feed.all({ page: req.query.page || 0 }, function(err, feeds) {
    if (err) return _handleError(err, req, res);

    // filter only public documents
    log('Serving feeds %j', pluck(feeds, 'id'));

    var keys = 'id type forum data createdAt';

    res.json(feeds.map(expose(keys)));
  });
});

/**
 * Helper functions
 */

function _handleError (err, req, res) {
  log('Error found: %s', err);
  var error = err;
  if (err.errors && err.errors.text) error = err.errors.text;
  if (error.type) error = error.type;

  res.status(400).json({ error: error });
}
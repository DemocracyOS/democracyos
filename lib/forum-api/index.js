/**
 * Module dependencies.
 */

var express = require('express');
var config = require('lib/config');
var api = require('lib/db-api');
var utils = require('lib/utils');
var restrict = utils.restrict;
var maintenance = utils.maintenance;
var log = require('debug')('democracyos:forum');

/**
 * Exports Application
 */

var app = module.exports = express();

/**
 * Define routes for Dashboard module
 */

app.get('/forum', function(req, res) {
  api.forum.all(function(err, forums) {
    if (err) return _handleError(err, req, res);
    return res.status(200).json(forums);
  });
});

app.get('/forum/mine', restrict, function(req, res) {
  api.forum.findOneByOwner(req.user.id, function(err, forum) {
    if (err) return _handleError(err, req, res);

    return res.status(200).json(forum);
  });
});

app.post('/forum', restrict, maintenance, function(req, res) {
  var data = {
    // url: config.manager.url,
    // access_token: config.manager.token,
    name: req.body.name,
    title: req.body.title,
    owner: req.user._id.toString(),
    summary: req.body.summary,
  };

  log('Trying to create forum: %o', data);

  api.forum.create(data, function (err, forum) {
    if (err) {
      log(err);
      return res.status(500).json({ error: 'Sorry, there was an unexpected error. Try again later please'});
    } else {
      log('Forum document created successfully');
      return res.status(200).json(forum);
    }
  });
});

app.delete('/forum/:id', restrict, maintenance, function(req, res) {

  api.forum.findById(req.params.id, function(err, forum) {
    if (err) return _handleError(err, req, res);
    if (!forum) return _handleError('The user doesnt have any forum.', req, res);

    log('Trying to delete forum: %o', forum);

    // TODO: delete forum document
  })
});

app.get('/forum/exists', function(req, res, next) {
  api.forum.exists(req.query.name, function(err, exists) {
    if (err) return next(err);
    return res.status(200).json({ exists: exists });
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

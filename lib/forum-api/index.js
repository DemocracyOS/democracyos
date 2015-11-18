var mongoose = require('mongoose');
var express = require('express');
var api = require('lib/db-api');
var utils = require('lib/utils');
var restrict = utils.restrict;
var maintenance = utils.maintenance;
var middlewares = require('lib/forum/middlewares');
var forum = middlewares.forum;
var privateForum = middlewares.private;
var restrictPermissions = middlewares.restrictPermissionsChange;
var Log = require('debug');
var regexps = require('lib/regexps');

var log = new Log('democracyos:forum-api');

var app = module.exports = express();

app.get('/forum/all', function(req, res) {
  var page = parseInt(req.query.page, 10) || 0;
  var limit = 20;

  api.forum.all({
    limit: limit,
    skip: page * limit
  }, function (err, forums) {
    if (err) return _handleError(err, req, res);
    res.json(forums).send();
  });
});

app.get('/forum/exists', function(req, res, next) {
  if (!api.forum.nameIsValid(req.query.name)) {
    return res.status(200).json({ exists: true });
  }

  api.forum.exists(req.query.name, function(err, exists) {
    if (err) return next(err);
    return res.status(200).json({ exists: exists });
  });
});

app.get('/forum/mine', restrict, function(req, res) {
  if (!req.isAuthenticated()) return res.status(404).send();

  api.forum.findOneByOwner(req.user.id, function(err, forum) {
    if (err) return _handleError(err, req, res);

    if (forum) {
      return res.status(200).json(forum);
    } else {
      return res.status(404).send();
    }
  });
});

app.get('/forum', forum, function(req, res, next) {
  return res.status(200).json(req.forum);
});

app.get('/forum/:id', forum, privateForum, function(req, res, next) {
  return res.status(200).json(req.forum);
});

app.get('/forum/:id/permissions', function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next();

  api.forum.getPermissions(req.params.id, function (err, permissions) {
    if (err) return _handleError(err, req, res);
    res.status(200).json(permissions);
  });
});

app.post('/forum/:id/permission', restrict, forum, restrictPermissions, function (req, res, next) {
  api.forum.grantPermission(req.params.id, req.body.user, req.body.role)
  .then(forum => res.status(200).send(forum))
  .catch(err => res.status(500).send(err));
});

app.del('/forum/:id/permission', restrict, forum, restrictPermissions, function (req, res, next) {
  api.forum.declinePermission(req.params.id, req.body.user, req.body.role)
  .then(forum => res.status(200).send(forum))
  .catch(err => res.status(500).send(err));
});

app.post('/forum', restrict, maintenance, function(req, res) {
  var data = {
    name: req.body.name,
    title: req.body.title,
    owner: req.user._id.toString(),
    body: req.body.body,
    summary: req.body.summary
  };

  log('Trying to create forum: %o', data);

  api.forum.create(data, function (err, forum) {
    if (err) return _handleError(err, req, res);
    log('Forum document created successfully');
    return res.status(200).json(forum);
  });
});

app.delete('/forum/:name', restrict, maintenance, function(req, res) {
  api.forum.findOneByName(req.params.name, function(err, forum) {
    if (err) return _handleError(err, req, res);
    if (!forum) return _handleError('Forum not found.', req, res);

    if (forum.owner.toString() !== req.user._id.toString()) {
      return res.status(401).send();
    }

    log('Trying to delete forum: %s', forum.id);

    api.forum.del(forum, function(_err) {
      if (_err) return res.status(500).json(_err);

      res.status(200).send();
    });
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


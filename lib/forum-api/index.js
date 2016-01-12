var config = require('lib/config');
var mongoose = require('mongoose');
var express = require('express');
var api = require('lib/db-api');
var utils = require('lib/utils');
var restrict = utils.restrict;
var maintenance = utils.maintenance;
var expose = utils.expose;
var middlewares = require('lib/forum-middlewares');
var privateForum = middlewares.private;
var restrictPermissionsChange = middlewares.restrictPermissionsChange;
var Log = require('debug');

var log = new Log('democracyos:forum-api');

var app = module.exports = express();

var ownerKeys = 'owner.id owner.fullName owner.displayName owner.avatar owner.locale';
var keys = ['id name title summary private closed createdAt', ownerKeys].join(' ');

app.get('/forum/all', function(req, res) {
  var page = parseInt(req.query.page, 10) || 0;
  var limit = 20;

  api.forum.all({
    limit: limit,
    skip: page * limit,
    owner: req.query.owner
  }, function (err, forums) {
    if (err) return _handleError(err, req, res);
    res.json(forums.map(expose(keys))).send();
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

  api.forum.findByOwner(req.user.id, function(err, forums) {
    if (err) return _handleError(err, req, res);

    if (forums) {
      return res.status(200).json(forums.map(expose(keys)));
    } else {
      return res.status(404).send();
    }
  });
});

function canVoteAndComment(forum, user) {
  return !config.multiForum || !forum.private || forum.isAdmin(user) || forum.hasRole('admin', user) || forum.hasRole('collaborator', user);
}

app.get('/forum', middlewares.forum, function(req, res) {
  var forum = req.forum.toJSON();
  if (req.user) {
    forum.canVoteAndComment = canVoteAndComment(forum, req.user);
  }
  return res.status(200).json(expose(keys)(forum));
});

app.get('/forum/:id', middlewares.forum, privateForum, function(req, res) {
  var forum = req.forum.toJSON();
  if (req.user) {
    forum.canVoteAndComment = canVoteAndComment(forum, req.user);
  }
  return res.status(200).json(expose(keys)(forum));
});

app.get('/forum/:id/permissions', function (req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return _handleError(new Error('Invalid :id'), req, res);
  }

  api.forum.getPermissions(req.params.id, function (err, permissions) {
    if (err) return _handleError(err, req, res);

    var json = {};
    var exp = expose(ownerKeys.replace(/owner\./g, ''));
    ['admins', 'collaborators'].forEach(function (role) {
      json[role] = permissions[role].map(exp);
    });

    res.status(200).json(json);
  });
});

app.post('/forum/:id/permissions',
  restrict,
  middlewares.forum,
  restrictPermissionsChange,
  function (req, res) {
    api.forum.grantPermission(req.params.id, req.body.user, req.body.role)
      .then(() => res.status(200).send())
      .catch(err => res.status(500).send(err));
  }
);

app.delete('/forum/:id/permissions',
  restrict,
  middlewares.forum,
  restrictPermissionsChange,
  function (req, res) {
    api.forum.revokePermission(req.params.id, req.body.user, req.body.role)
      .then(() => res.status(200).send())
      .catch(err => res.status(500).send(err));
  }
);

app.post('/forum', restrict, maintenance, function(req, res) {
  var data = {
    name: req.body.name,
    title: req.body.title,
    owner: req.user._id.toString(),
    body: req.body.body,
    summary: req.body.summary,
    private: req.body.private,
    permissions: req.body.permissions
  };

  log('Trying to create forum: %o', data);

  api.forum.create(data, function (err, forum) {
    if (err) return _handleError(err, req, res);
    log('Forum document created successfully');
    return res.status(200).json(expose(keys)(forum));
  });
});

app.delete('/forum/:id', restrict, maintenance, function(req, res) {
  api.forum.findById(req.params.id, function(err, forum) {
    if (err) return _handleError(err, req, res);
    if (!forum) return _handleError('Forum not found.', req, res);

    if (!forum.owner._id.equals(req.user._id)) {
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


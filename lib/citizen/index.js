/**
 * Module dependencies.
 */

var express = require('express');
var utils = require('lib/utils');
var accepts = require('lib/accepts')
var restrict = utils.restrict;
var pluck = utils.pluck;
var expose = utils.expose;
var api = require('lib/db-api');
var log = require('debug')('democracyos:citizen');
var t = require('t-component');
var mongoose = require('mongoose');
var Citizen = mongoose.model('Citizen');
var auth =   Citizen.authenticate();

var app = module.exports = express();

/**
 * Limit request to json format only
 */

app.use(accepts('application/json'));

app.get('/citizen/me', restrict, function (req, res) {
  log('Request /citizen/me');

  log('Serving citizen %j', req.user.id);
  res.json(expose('id firstName lastName email gravatar() staff profilePictureUrl')(req.user));
});

app.get('/citizen/search', restrict, function (req, res) {
  var q = req.param('q');

  log('Request /citizen/search %j', q);

  api.citizen.search(q, function(err, citizens) {
    if (err) return _handleError(err, req, res);

    log('Serving citizens %j', pluck(citizens, 'id'));
    res.json(citizens.map(expose('id fullName gravatar() profilePictureUrl')));
  });
});

app.get('/citizen/lookup', function (req, res) {
  var ids = req.param('ids');

  log('Request /citizen/lookup %j', ids);

  if (!ids) return log('Cannot process without ids'), res.json(500,{});

  api.citizen.lookup(ids.split(','), function(err, citizens) {
    if (err) return _handleError(err, req, res);

    log('Serving citizens %j', pluck(citizens, 'id'));
    res.json(citizens.map(expose('id fullName gravatar() profilePictureUrl')));
  });
});

// This is a temporary hack while lookinf for a better solution to
// this error: 414 Request-URI Too Large
app.post('/citizen/lookup', function (req, res) {
  var ids = req.param('ids');

  log('Request /citizen/lookup %j', ids);

  if (!ids) return log('Cannot process without ids'), res.json(500,{});

  api.citizen.lookup(ids, function(err, citizens) {
    if (err) return _handleError(err, req, res);

    log('Serving citizens %j', pluck(citizens, 'id'));
    res.json(citizens.map(expose('id fullName gravatar() profilePictureUrl')));
  });
});


app.post('/citizen/delete', restrict, function (req, res) {
  var citizen = req.user;
  auth(citizen.email, req.body.password, function (err, citizen, info) {
    if (err) {
      return res.json(200, { error: t(err.message) });
    };
    if (!citizen) {
      return res.json(200, { error: t(info.message) });
    };
    if (!citizen.emailValidated) {
      return res.json(200, { error: t("Email not validated") });
    };
    req.login(citizen, function(err) {
      if (err) return res.json(200, { error: t(err.message) });
      return res.json(200);
    })
  });
});

app.get('/citizen/:id', restrict, function (req, res) {
  log('Request /citizen/%s', req.params.id);

  api.citizen.get(req.params.id, function (err, citizen) {
    if (err) return _handleError(err, req, res);

    log('Serving citizen %j', citizen.id);
    res.json(expose('id fullName gravatar() profilePictureUrl')(citizen));
  });
});

function _handleError (err, req, res) {
  res.format({
    html: function() {
      // this should be handled better!
      // maybe with flash or even an
      // error page.
      log('Error found with html request %j', err);
      res.redirect('back');
    },
    json: function() {
      log("Error found: %j", err);
      res.json({ error: err });
    }
  })
}
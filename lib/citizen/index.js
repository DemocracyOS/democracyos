/**
 * Module dependencies.
 */

var express = require('express');
var utils = require('lib/utils');
var restrict = utils.restrict;
var pluck = utils.pluck;
var map = utils.map;
var api = require('lib/db-api');
var log = require('debug')('democracyos:citizen');

var app = module.exports = express();

app.get('/citizen/all', restrict, function (req, res) {
  log('Request /citizen/all');

  api.citizen.all(function(err, citizens) {
    if (err) return _handleError(err, req, res);

    log('Serving citizens %j', pluck(citizens, 'id'));
    res.json(citizens);
  });
});

app.get('/citizen/me', restrict, function (req, res) {
  log('Request /citizen/me');

  log('Serving citizen %j', req.user.id);
  res.json(map('id firstName lastName email gravatar()')(req.user));

});

app.get('/citizen/search', restrict, function (req, res) {
  var q = req.param('q');

  log('Request /citizen/search %j', q);

  api.citizen.search(q, function(err, citizens) {
    if (err) return _handleError(err, req, res);

    log('Serving citizens %j', pluck(citizens, 'id'));
    res.json(citizens.map(map('id fullName gravatar()')));
  })
});

app.get('/citizen/lookup', function (req, res) {
  var ids = req.param('ids');

  log('Request /citizen/lookup %j', ids);

  if (!ids) return log('Cannot process without ids'), res.json(500,{});

  api.citizen.lookup(ids.split(','), function(err, citizens) {
    if (err) return _handleError(err, req, res);

    log('Serving citizens %j', pluck(citizens, 'id'));
    res.json(citizens.map(map('id fullName gravatar()')));
  })
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
    res.json(citizens.map(map('id fullName gravatar()')));
  })
});

app.get('/citizen/:id', restrict, function (req, res) {
  log('Request /citizen/%s', req.params.id);

  api.citizen.get(req.params.id, function (err, citizen) {
    if (err) return _handleError(err, req, res);
  
    log('Serving citizen %j', citizen.id);
    res.json(citizen);
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
/**
 * Module dependencies.
 */

var express = require('express')
  , restrict = require('lib/utils').restrict
  , api = require('lib/db-api')
  , log = require('debug')('democracyos:citizen');

var app = module.exports = express();

app.get('/citizen/all', restrict, function (req, res) {
  log('Request /citizen/all');

  api.citizen.all(function(err, citizens) {
    if (err) return _handleError(err, req, res);

    log('Serving citizens %j', citizens);
    res.json(citizens);
  });
});

app.get('/citizen/me', restrict, function (req, res) {
  log('Request /citizen/me');

  log('Serving citizen %j', req.user);
  res.json(req.user);

});

app.get('/citizen/search', restrict, function (req, res) {
  var q = req.param('q');

  log('Request /citizen/search %j', q);

  api.citizen.search(q, function(err, citizens) {
    if (err) return _handleError(err, req, res);

    log('Serving citizens %j', citizens);
    res.json(citizens);
  })
});

app.get('/citizen/lookup', restrict, function (req, res) {
  var ids = req.param('participants');

  log('Request /citizen/lookup %j', ids);

  api.citizen.lookup(ids, function(err, citizens) {
    if (err) return _handleError(err, req, res);

    log('Serving citizens %j', citizens);
    res.json(citizens);
  })
});

app.get('/citizen/:id', restrict, function (req, res) {
  log('Request /citizen/%s', req.params.id);

  api.citizen.get(req.params.id, function (err, citizen) {
    if (err) return _handleError(err, req, res);
  
    log('Serving citizen %j', citizen);
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
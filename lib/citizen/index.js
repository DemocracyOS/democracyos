/**
 * Module dependencies.
 */

var express = require('express')
  , restrict = require('lib/utils').restrict
  , api = require('lib/db-api')
  , log = require('debug')('citizen');

var app = module.exports = express();

app.get('/citizen/all', function (req, res) {
  log('Request /citizen/all');

  api.citizen.all(function(err, citizens) {
    if (err) return _handleError(err, req, res);

    log('Serving citizens %j', citizens);
    res.json(citizens);
  });
});

app.get('/citizen/me', utils.restrict, function (req, res) {
  log('Request /citizen/me');

  log('Serving citizen %j', req.user);
  res.json(req.user);

});

app.get('/citizen/:id', function (req, res) {
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
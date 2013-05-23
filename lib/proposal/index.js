/**
 * Module dependencies.
 */

var express = require('express')
  , api = require('lib/db-api')
  , log = require('debug')('proposal');

var app = module.exports = express();

app.get('/proposal/:id', function (req, res) {
  log('Request /proposal/%s', req.params.id);

  api.proposal.get(req.params.id, function (err, proposal) {
    if (err) return _handleError(err, req, res);
  
    log('Serving proposal %j', proposal);
    res.json(proposal);
  });
});


app.post('/proposal/create', function (req, res) {
  log('Request /proposal/create %j', req.body.proposal);
  var p = req.body.proposal;
  p.user = req.user;

  api.proposal.create(p, function (err, proposal) {
    if (err) return _handleError(err, req, res);

    log('Serving proposal %j', proposal);
    res.json(proposal);
  });
});

function _handleError (err, req, res) {
  log("Error found: %j", err);
  res.json({ error: err });
}
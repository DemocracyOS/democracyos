/**
 * Module dependencies.
 */

var express = require('express')
  , db = require('lib/db/proposal')
  , log = require('debug')('proposal:api');

var app = module.exports = express();

app.get('/proposal/:id', function (req, res) {
  log('Request /api/proposal/%s', req.params.id);

  db.get(req.params.id, function ())
});


app.post('/proposal/create', function (req, res) {
  log('Request /proposal/create %j', req.body.proposal);
  var p = req.body.proposal;
  p.user = req.user;

  db.create(p, function (err, proposal) {
    if (err) return _handleError(err, req, res);

    log('Serving proposal %j', proposal)
    res.json(proposal);
  });
});

function _handleError (err, req, res) {
  log("Error found: %j", err);
  res.json({ error: err });
}
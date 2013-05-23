/**
 * Module dependencies.
 */

var express = require('express')
  , db = require('lib/proposal')
  , log = require('debug')('proposal:api');

var app = module.exports = express();

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
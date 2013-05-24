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
  var proposal = req.body.proposal;
  // This must be uncommented on production!
  // proposal.author = req.author;

  api.proposal.create(proposal, function (err, proposalDoc) {
    if (err) return _handleError(err, req, res);

    log('Serving proposal %j', proposalDoc);
    res.json(proposalDoc);
  });
});

app.post('/proposal/:id/comment', function (req, res) {
  log('Request /proposal/%s/comment %j', req.params.id, req.body.comment);
  var comment = req.body.comment;
  // This must be uncommented on production!
  // comment.author = req.author;

  api.proposal.comment(req.params.id, comment, function (err, proposal) {
    if (err) return _handleError(err, req, res);

    log('Serving proposal %j', proposal);
    res.json(proposal);
  });
});

function _handleError (err, req, res) {
  log("Error found: %j", err);
  res.json({ error: err });
}
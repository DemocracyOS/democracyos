/**
 * Module dependencies.
 */

var express = require('express');
var restrict = require('lib/utils').restrict;
var accepts = require('lib/accepts');
var api = require('lib/db-api');
var log = require('debug')('democracyos:proposal');

var app = module.exports = express();

/**
 * Limit request to json format only
 */

app.use(accepts('application/json'));

app.get('/proposal/all', function (req, res) {
  log('Request /proposal/all');

  api.proposal.all(function(err, proposals) {
    if (err) return _handleError(err, req, res);

    log('Serving proposals %j', proposals);
    res.json(proposals);
  });
});

app.get('/proposal/:id', function (req, res) {
  log('Request /proposal/%s', req.params.id);

  api.proposal.get(req.params.id, function (err, proposal) {
    if (err) return _handleError(err, req, res);
  
    log('Serving proposal %j', proposal);
    res.json(proposal);
  });
});

app.post('/proposal/create', restrict, function (req, res) {
  log('Request /proposal/create %j', req.body.proposal);

  var proposal = req.body.proposal;
  // This must be uncommented on production!
  proposal.author = req.user;

  api.proposal.create(proposal, function (err, proposalDoc) {
    if (err) return _handleError(err, req, res);

    res.format({
      html: function() {
        log('Redirect to home.')
        res.redirect('/');
      },
      json: function() {
        log('Serving proposal %j', proposalDoc);
        res.json(proposalDoc);
      }
    })
  });
});

app.get('/proposal/:id/comments', function (req, res) {
  log('Request /proposal/%s/comments', req.params.id);

  api.proposal.comments(req.params.id, function (err, comments) {
    if (err) return _handleError(err, req, res);

    res.format({
      html: function() {
        log('Redirecting back from html request.');
        res.redirect('back');
      },
      json: function() {
        log('Serving comments %j', comments);
        res.json(comments);
      }
    })
  });
});

app.post('/proposal/:id/comment', restrict, function (req, res) {
  log('Request /proposal/%s/comment %j', req.params.id, req.body.comment);
  var comment = req.body.comment;
  // This must be uncommented on production!
  comment.author = req.user;

  api.proposal.comment(req.params.id, comment, function (err, proposal) {
    if (err) return _handleError(err, req, res);

    res.format({
      html: function() {
        log('Redirecting back from html request.');
        res.redirect('back');
      },
      json: function() {
        log('Serving proposal %j', proposal);
        res.json(proposal);
      }
    })
  });
});

app.post('/proposal/:id/vote', restrict, function (req, res) {
  log('Request /proposal/%s/vote %s', req.params.id, req.body.value);
  var proposal = req.params.id;
  var value = req.body.value;

  api.proposal.vote(proposal, req.user, value, function (err, proposal) {
    if (err) return _handleError(err, req, res);

    res.format({
      html: function() {
        log('Redirecting back from html request.');
        res.redirect('back');
      },
      json: function() {
        log('Serving proposal %j', proposal);
        res.json(proposal);
      }
    })
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
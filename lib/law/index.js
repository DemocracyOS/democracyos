/**
 * Module dependencies.
 */

var express = require('express');
var api = require('lib/db-api');
var utils = require('lib/utils');
var accepts = require('lib/accepts');
var restrict = utils.restrict;
var pluck = utils.pluck;
var map = utils.map;
var log = require('debug')('democracyos:law');

var app = module.exports = express();

/**
 * Limit request to json format only
 */

app.use(accepts('application/json'));

app.get('/law/all', function (req, res) {
  log('Request /law/all');

  api.law.all(function(err, lawDocs) {
    if (err) return _handleError(err, req, res);

    log('Serving laws %j', pluck(lawDocs, "id"));
    res.json(lawDocs);
  });
});

app.get('/law/:id', function (req, res) {
  log('Request /law/%s', req.params.id);

  api.law.get(req.params.id, function (err, lawDoc) {
    if (err) return _handleError(err, req, res);
  
    log('Serving law %s', lawDoc.id);
    res.json(lawDoc);
  });
});

app.get('/law/:id/comments', function (req, res) {
  log('Request /law/%s/comments', req.params.id);

  api.law.comments(req.params.id, function (err, comments) {
    if (err) return _handleError(err, req, res);
  
    log('Serving law %s comments %j', req.params.id, pluck(comments, 'id'));

    var keys = [
      "id text createdAt context reference",
      "author.id author.fullName author.gravatar()",
      "flags upvotes downvotes votes"
    ].join(' ');

    res.json(comments.map(map(keys)));
  });
});

app.post('/law/:id/comment', restrict, function (req, res) {
  log('Request /law/%s/comment %j', req.params.id, req.body.comment);
  
  var comment = req.body.comment;
  // This must be uncommented on production!
  comment.author = req.user;

  api.law.comment(comment, function (err, commentDoc) {
    if (err) return _handleError(err, req, res);
    res.json(200, commentDoc);
  });
});

app.post('/law/:id/vote', function (req, res) {
  log('Request /law/%s/vote', req.param('id'));

  api.law
  .vote(
    req.param('id'),
    req.user,
    req.param('value'),
    function (err, comments) {
      if (err) return _handleError(err, req, res);

      log('Serving 200 OK response');
      res.json(200);
    }
  );
});

app.post('/law/create', function (req, res) {
  log('Request /law/create %j', req.body.law);

  var law = req.body.law;

  api.law.create(law, function (err, lawDoc) {
    if (err) return _handleError(err, req, res);

    res.format({
      html: function() {
        log('Redirect to home.')
        res.redirect('/');
      },
      json: function() {
        log('Serving law %j', lawDoc.id);
        res.json(lawDoc);
      }
    })
  });
});

function _handleError (err, req, res) {
  log("Error found: %s", err);
  var error = err;
  if (err.errors && err.errors.text) error = err.errors.text;
  if (error.type) error = error.type;

  res.json(400, { error: error });
}
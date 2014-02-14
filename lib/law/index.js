/**
 * Module dependencies.
 */

var express = require('express');
var api = require('lib/db-api');
var utils = require('lib/utils');
var accepts = require('lib/accepts');
var restrict = utils.restrict;
var staff = utils.staff;
var pluck = utils.pluck;
var expose = utils.expose;
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

    var keys = [
      'id lawId mediaTitle status open closed',
      'tag participants voted',
      'createdAt updatedAt closingAt'
    ].join(' ');

    lawDocs.forEach(function(law) {
      if (!req.user) return law.voted = false;
      law.voted = law.votedBy(req.user);
    });

    res.json(lawDocs.map(expose(keys)));
  });
});

app.get('/law/:id', function (req, res) {
  log('Request GET /law/%s', req.params.id);

  api.law.get(req.params.id, function (err, lawDoc) {
    if (err) return _handleError(err, req, res);

    log('Serving law %s', lawDoc.id);
    var keys = [
      'id lawId title mediaTitle summary clauses source status open closed',
      'satus state tag participants',
      'upvotes downvotes abstentions',
      'createdAt updatedAt closingAt'
    ].join(' ');

    res.json(expose(keys)(lawDoc.toJSON()));
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

    res.json(comments.map(expose(keys)));
  });
});

app.post('/law/:id/comment', restrict, function (req, res) {
  log('Request /law/%s/comment %j', req.params.id, req.body.comment);
  
  var comment = req.body.comment;
  // This must be uncommented on production!
  comment.author = req.user;

  api.law.comment(comment, function (err, commentDoc) {
    if (err) return _handleError(err, req, res);

    var keys = [
      'id text',
      'author.id author.fullName author.gravatar()',
      'upvotes downvotes flags',
      'createdAt'
    ].join(' ');

    res.json(200, expose(keys)(commentDoc));
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
      res.send(200);
    }
  );
});

app.post('/law/create', restrict, staff, function (req, res, next) {
  log('Request /law/create %j', req.body.law);

  api.law.create(req.body, function (err, lawDoc) {
    if (err) return next(err);
    var keys = [
      'id lawId title mediaTitle summary clauses source',
      'satus state tag participants',
      'upvotes downvotes abstentions',
      'createdAt updatedAt closingAt'
    ].join(' ');
    res.json(expose(keys)(lawDoc));
  });
});

app.post('/law/:id', restrict, staff, function (req, res) {
  log('Request POST /law/%s', req.params.id);

  api.law.update(req.params.id, req.body, function (err, lawDoc) {
    if (err) return _handleError(err, req, res);

    log('Serving law %s', lawDoc.id);
    var keys = [
      'id lawId title mediaTitle summary clauses source status open closed',
      'satus state tag participants',
      'upvotes downvotes abstentions',
      'createdAt updatedAt closingAt'
    ].join(' ');

    res.json(expose(keys)(lawDoc.toJSON()));
  });
});

function _handleError (err, req, res) {
  log("Error found: %s", err);
  var error = err;
  if (err.errors && err.errors.text) error = err.errors.text;
  if (error.type) error = error.type;

  res.json(400, { error: error });
}
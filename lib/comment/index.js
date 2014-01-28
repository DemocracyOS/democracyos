/**
 * Module dependencies.
 */

var express = require('express');
var restrict = require('lib/utils').restrict;
var accepts = require('lib/accepts');
var utils = require('lib/utils');
var expose = utils.expose;
var api = require('lib/db-api');
var log = require('debug')('democracyos:comment')

var app = module.exports = express();

/**
 * Limit request to json format only
 */

app.use(accepts('application/json'));

app.post('/comment/:id/reply', restrict, function (req, res) {
  log('Request /comment/%s/reply %j', req.params.id, req.body.reply);

  var reply = req.body.reply;
  // This must be uncommented on production!
  // reply.author = req.author;
  api.comment.reply(req.params.id, reply, function (err, replyDoc) {
    if (err) return _handleError(err, req, res);

    log('Serving reply %j', replyDoc);

    var keys = [
      'id createdAt',
      'author.id author.fullName author.gravatar()'
    ].join(' ');

    res.json(expose(keys)(replyDoc));
  });
});

app.post('/comment/:id/upvote', restrict, function(req, res) {
  log('Request /comment/%s/upvote', req.params.id);

  api.comment.upvote(req.params.id, req.user, function(err, comment) {
    if (err) return _handleError(err, req, res);

    log('Serving comment %s', comment.id);
    res.send(200);
  });
});

app.post('/comment/:id/downvote', restrict, function(req, res) {
  log('Request /comment/%s/upvote', req.params.id);

  api.comment.downvote(req.params.id, req.user, function(err, comment) {
    if (err) return _handleError(err, req, res);

    log('Serving comment %s', comment.id);
    res.send(200);
  });
});

app.post('/comment/:id/flag', restrict, function(req, res) {
  log('Request /comment/%s/flag', req.params.id);

  api.comment.flag(req.params.id, req.user, function(err, comment) {
    if (err) return _handleError(err, req, res);

    log('Serving comment %s', comment.id);
    res.send(200);
  });
});

app.post('/comment/:id/unflag', restrict, function(req, res) {
  log('Request /comment/%s/unflag', req.params.id);

  api.comment.unflag(req.params.id, req.user, function(err, comment) {
    if (err) return _handleError(err, req, res);

    log('Serving comment %s', comment.id);
    res.send(200);
  });
});

function _handleError (err, req, res) {
  log("Error found: %j", err);
  res.json({ error: err });
}
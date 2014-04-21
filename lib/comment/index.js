/**
 * Module dependencies.
 */

var express = require('express');
var restrict = require('lib/utils').restrict;
var accepts = require('lib/accepts');
var utils = require('lib/utils');
var expose = utils.expose;
var api = require('lib/db-api');
var t = require('t-component');
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

app.get('/comment/:id/replies', function (req, res) {
  log('Request /comment/%s/replies', req.params.id);

  api.comment.replies(req.params.id, function(err, replies) {
    if (err) return _handleError(err, req, res);

    log('Serving replies for comment %s', req.params.id);
    res.json(replies);
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

app.put('/comment/:id', function (req, res) {
  log('Request PUT /comment/%s', req.params.id);

  api.comment.getFor( { _id: req.params.id }, function (err, comments) {
    if (err) return _handleError(err, req, res);

    var comment = comments[0];
    log('Found comment %s to be updated', comment.id);
    if (comment.author.id != req.user.id) {
      err = t("That comment is not yours!");
      return _handleError(err, req, res);
    } else {
      comment.text = req.body.text;
      api.comment.edit(comment, function (err, comment) {
        if (err) return _handleError(err, req, res);

        log('Serving comment %s', comment.id);
        res.json(200, { id: comment.id, text: comment.text, editedAt: comment.editedAt });
      });
    }
  });
});

app.del('/comment/:id', function (req, res) {
  log('Request DELETE /comment/%s', req.params.id);

  api.comment.getFor( { _id: req.params.id }, function (err, comments) {
    if (err) return _handleError(err, req, res);

    var comment = comments[0];
    log('Found comment %s to be removed', comment.id);
    if (comment.author.id != req.user.id) {
      err = t("That comment is not yours!");
      return _handleError(err, req, res);
    } else {
      api.comment.remove(comment, function (err) {
        if (err) return _handleError(err, req, res);

        res.json(200);
      });
    }
  });
});

function _handleError (err, req, res) {
  log("Error found: %j", err);
  res.json({ error: err });
}
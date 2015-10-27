/**
 * Module dependencies.
 */

var express = require('express');
var restrict = require('lib/utils').restrict;
var accepts = require('lib/accepts');
var utils = require('lib/utils');
var expose = utils.expose;
var pluck = utils.pluck;
var api = require('lib/db-api');
var t = require('t-component');
var notifier = require('lib/notifications').notifier;
var log = require('debug')('democracyos:comment');

var app = module.exports = express();

/**
 * Limit request to json format only
 */

app.use(accepts('application/json'));

app.get('/comment/all', function (req, res) {
  if (!req.query.id) {
    log("Request didn't include `id` parameter");
    return res.error(400);
  }

  log('Request /comment/all for %s', req.query.id);

  var sort = '';
  if (~['-score', '-createdAt', 'createdAt'].indexOf(req.query.sort)) {
    sort = req.query.sort;
  } else {
    sort = '-score';
  }

  var paging = {
    page: req.query.page || 0,
    limit: req.query.limit || 0,
    sort: sort,
    exclude_user: req.query.exclude_user || null
  };

  api.comment.comments(req.query.id, paging, function (err, comments) {
    if (err) return _handleError(err, req, res);

    if (!req.query.count) {
      log('Serving %s comments %j', req.query.id, pluck(comments, 'id'));

      var keys = [
        "id text createdAt editedAt context reference",
        "author.id author.fullName author.displayName author.avatar",
        "flags upvotes downvotes votes replies.length"
      ].join(' ');

      res.json(comments.map(expose(keys)));
    } else {
      log('Serving %s comments count: %d', req.query.id, comments.length);

      res.json(comments.length);
    }
  });
});

app.get('/comment/my-comments', restrict, function (req, res) {
  if (!req.query.id) {
    log("Request didn't include `id` parameter");
    return res.error(400);
  }

  log('Request /comment/my-comments for %s',  req.query.id);

  api.comment.userComments(req.query.id, req.user.id, function (err, comments) {
    if (err) return _handleError(err, req, res);

    log('Serving %s comments %j for user %s', req.query.id, pluck(comments, 'id'), req.user.id);

    var keys = [
      "id text createdAt editedAt context reference",
      "author.id author.fullName author.displayName author.avatar",
      "flags upvotes downvotes votes replies.length"
    ].join(' ');

    res.json(comments.map(expose(keys)));
  });
});


app.post('/comment/comment', restrict, function (req, res) {
  if (!req.query.id) {
    log("Request didn't include `id` parameter");
    res.error(400);
  }

  log('Request /comment/comment for %s with %j', req.query.id, req.body);
  
  var comment = {
    text: req.body.text,
    context: req.body.context || 'topic',
    reference: req.body.reference || req.query.id,
    topicId: req.query.id,
    author: req.user.id
  };

  api.comment.create(comment, function (err, commentDoc) {
    if (err) return _handleError(err, req, res);

    var keys = [
      'id text',
      'author.id author.fullName author.displayName author.avatar',
      'upvotes downvotes flags',
      'createdAt replies context reference'
    ].join(' ');

    res.json(200, expose(keys)(commentDoc));
  });
});

app.get('/comment/sidecomments', function (req, res) {
  if (!req.query.id) {
    log("Request didn't include `id` parameter");
    res.error(400);
  }

  log('Requesting sidecomments for topic %s', req.query.id);

  api.comment.getSideComments(req.query.id, null, function (err, comments) {
    if (err) return _handleError(err, req, res);
    log('Serving %s %s body\'s comments %j', req.query.id, pluck(comments, 'id'));

    var keys = [
      'id text createdAt editedAt context reference',
      'author.id author.fullName author.displayName author.avatar',
      'flags upvotes downvotes votes replies.length'
    ].join(' ');

    res.json(comments.map(expose(keys)));
  });
});

app.post('/comment/:id/reply', restrict, function (req, res) {
  log('Request /comment/%s/reply %j', req.params.id, req.body.reply);

  var reply = req.body.reply;
  reply.author = req.user;
  api.comment.reply(req.params.id, reply, function (err, replyDoc) {
    if (err) return _handleError(err, req, res);

    log('Serving reply %j', replyDoc);

    var keys = [
      'id createdAt text',
      'author.id author.fullName author.avatar'
    ].join(' ');

    res.json(expose(keys)(replyDoc));
  });
});

app.get('/comment/:id/replies', function (req, res) {
  log('Request /comment/%s/replies', req.params.id);

  api.comment.replies(req.params.id, function(err, replies) {
    if (err) return _handleError(err, req, res);

    var keys = [
      "id createdAt editedAt text",
      "author.id author.fullName author.avatar"
    ].join(' ');

    log('Serving replies for comment %s', req.params.id);
    res.json(replies.map(expose(keys)));
  });
});

app.post('/comment/:id/upvote', restrict, function(req, res) {
  log('Request /comment/%s/upvote', req.params.id);

  api.comment.upvote(req.params.id, req.user, function(err, comment) {
    if (err) {
      if (comment && comment.author.id == req.user.id) {
        return res.json(401, {error: err});
      }
    }

    log('Serving comment %s', comment.id);
    res.send(200);
  });
});

app.post('/comment/:id/downvote', restrict, function(req, res) {
  log('Request /comment/%s/upvote', req.params.id);

  api.comment.downvote(req.params.id, req.user, function(err, comment) {
    if (err) {
      if (comment && comment.author.id == req.user.id) {
        return res.json(401, {error: err});
      }
    }

    log('Serving comment %s', comment.id);
    res.send(200);
  });
});

app.post('/comment/:id/unvote', restrict, function(req, res) {
  log('Request /comment/%s/upvote', req.params.id);
  api.comment.unvote(req.params.id, req.user, function(err, comment) {
    if (err) {
      if (comment && comment.author.id == req.user.id) {
        return res.json(401, {error: err});
            }
        }

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

app.put('/comment/:id', restrict, function (req, res) {
  log('Request PUT /comment/%s', req.params.id);

  api.comment.getFor( { _id: req.params.id }, null, function (err, comments) {
    if (err) return _handleError(err, req, res);

    var comment = comments[0];
    log('Found comment %s to be updated', comment.id);
    if (comment.author.id != req.user.id) {
      err = t('comments.not-yours');
      return _handleError(err, req, res);
    } else {
      comment.text = req.body.text;
      comment.editedAt = Date.now();
      api.comment.edit(comment, function (err, comment) {
        if (err) return _handleError(err, req, res);

        log('Serving comment %s', comment.id);

        var keys = [
        'id text',
        'author.id author.fullName author.avatar',
        'upvotes downvotes flags',
        'createdAt editedAt replies context reference'
        ].join(' ');

        res.json(200, expose(keys)(comment));
      });
    }
  });
});

app.put('/comment/:commentId/reply/:replyId', restrict, function (req, res) {
  log('Request PUT /comment/%s/reply/%s', req.params.commentId, req.params.replyId);

  api.comment.getFor( { _id: req.params.commentId }, null, function (err, comments) {
    if (err) return _handleError(err, req, res);

    var comment = comments[0];
    var reply = comment.replies.id(req.params.replyId);
    log('Found comment %s and reply %s', comment.id, reply.id);
    if (reply.author != req.user.id) {
      err = t('comments.not-yours');
      return _handleError(err, req, res);
    } else {
      reply.text = req.body.text;
      reply.editedAt = Date.now();
      api.comment.editReply(comment, reply, function (err, comment) {
        if (err) return _handleError(err, req, res);

        log('Serving reply %s', reply.id);
        res.json(200, { id: reply.id, text: reply.text, editedAt: reply.editedAt });
      });
    }
  });
});

app.delete('/comment/:commentId/reply/:replyId', restrict, function (req, res) {
  log('Request DELETE /comment/%s/reply/%s', req.params.commentId, req.params.replyId);

  api.comment.getFor( { _id: req.params.commentId }, null, function (err, comments) {
    if (err) return _handleError(err, req, res);

    var comment = comments[0];
    log('Found comment %s to remove reply %s', comment.id, req.params.replyId);
    var reply = comment.replies.id(req.params.replyId);
    log('User %s is attempting to remove reply %s', req.user.id, reply.id);
    if (reply.author != req.user.id && !req.user.staff) {
      err = t("That reply is not yours!");
      return _handleError(err, req, res);
    } else {
      comment.replies.id(reply.id).remove();
      comment.save(function (err) {
        if (err) return _handleError(err, req, res);
        res.json(200);
      });
    }
  });
});

app.delete('/comment/:id', restrict, function (req, res) {
  log('Request DELETE /comment/%s', req.params.id);

  api.comment.getFor( { _id: req.params.id }, null, function (err, comments) {
    if (err) return _handleError(err, req, res);

    var comment = comments[0];
    log('Found comment %s to be removed', comment.id);
    if (comment.author.id != req.user.id && !req.user.staff) {
      err = t('comments.not-yours');
      return _handleError(err, req, res);
    } else if (comment.replies.length && !req.user.staff) {
      err = t('comments.cannot-remove');
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
  log('Error found: %j', err);
  res.json({ error: err });
}
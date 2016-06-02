var express = require('express');
var restrict = require('lib/utils').restrict;
var accepts = require('lib/accepts');
var utils = require('lib/utils');
var expose = utils.expose;
var api = require('lib/db-api');
var privileges = require('lib/forum-middlewares').privileges;
var t = require('t-component');

var log = require('debug')('democracyos:comment');

var app = module.exports = express();

/**
 * Limit request to json format only
 */

app.use(accepts('application/json'));

app.param('id', function (req, res, next, id) {
  api.comment.getById(id, function (err, comment) {
    if (err) {
      log('Error fetching comment: %s', err);
      return res.status(404).send();
    }

    if (!comment) return res.status(404).send();

    req.comment = comment;

    var topicId = comment.topicId || comment.reference;

    if (!topicId) {
      log('Error getting topicId of comment: %s', id);
      return res.status(500).send();
    }

    api.topic.get(topicId, function (topicErr, topic) {
      if (topicErr) {
        log('Error fetching topic of comment: %s', topicErr);
        return res.status(500).send();
      }

      if (!topic) {
        log('Error finding topic of comment: %s', id, topicId);
        return res.status(500).send();
      }

      req.topic = topic;

      if (!topic.forum) {
        log('Error finding forum of comment: %s', topic.forum);
        return res.status(500).send();
      }

      api.forum.findById(topic.forum, function (_err, forum) {
        if (_err || !forum) return _handleError(_err, req, res);
        req.forum = forum;
        next();
      });
    });
  });
});

app.post('/comment/:id/reply', restrict, privileges('canVoteAndComment'), function (req, res) {
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

app.get('/comment/:id/replies', privileges('canView'), function (req, res) {
  log('Request /comment/%s/replies', req.params.id);

  api.comment.replies(req.params.id, function(err, replies) {
    if (err) return _handleError(err, req, res);

    var keys = [
      'id createdAt editedAt text',
      'author.id author.fullName author.avatar'
    ].join(' ');

    log('Serving replies for comment %s', req.params.id);
    res.json(replies.map(expose(keys)));
  });
});

app.post('/comment/:id/upvote', restrict, privileges('canVoteAndComment'), function (req, res) {
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

app.post('/comment/:id/downvote', restrict, privileges('canVoteAndComment'), function (req, res) {
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

app.post('/comment/:id/unvote', restrict, privileges('canVoteAndComment'), function (req, res) {
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

app.post('/comment/:id/flag', restrict, privileges('canVoteAndComment'), function (req, res) {
  log('Request /comment/%s/flag', req.params.id);

  api.comment.flag(req.params.id, req.user, function(err, comment) {
    if (err) return _handleError(err, req, res);

    log('Serving comment %s', comment.id);
    res.send(200);
  });
});

app.post('/comment/:id/unflag', restrict, privileges('canVoteAndComment'), function (req, res) {
  log('Request /comment/%s/unflag', req.params.id);

  api.comment.unflag(req.params.id, req.user, function(err, comment) {
    if (err) return _handleError(err, req, res);

    log('Serving comment %s', comment.id);
    res.send(200);
  });
});

app.put('/comment/:id', restrict, privileges('canVoteAndComment'), function (req, res) {
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
      api.comment.edit(comment, function (_err) {
        if (_err) return _handleError(_err, req, res);

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

app.put('/comment/:id/reply/:replyId', restrict, privileges('canVoteAndComment'), function (req, res) {
  log('Request PUT /comment/%s/reply/%s', req.params.id, req.params.replyId);

  api.comment.getFor( { _id: req.params.id }, null, function (err, comments) {
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
      api.comment.editReply(comment, reply, function (_err) {
        if (_err) return _handleError(_err, req, res);

        log('Serving reply %s', reply.id);
        res.json(200, { id: reply.id, text: reply.text, editedAt: reply.editedAt });
      });
    }
  });
});

app.delete('/comment/:id/reply/:replyId', restrict, privileges('canVoteAndComment'), function (req, res) {
  log('Request DELETE /comment/%s/reply/%s', req.params.id, req.params.replyId);

  api.comment.getFor({ _id: req.params.id}, null, function (err, comments) {
    if (err) return _handleError(err, req, res);

    var comment = comments[0];
    log('Found comment %s to remove reply %s', comment.id, req.params.replyId);
    var reply = comment.replies.id(req.params.replyId);
    log('User %s is attempting to remove reply %s', req.user.id, reply.id);
    if (reply.author != req.user.id && !req.user.staff) {
      err = t('That reply is not yours!');
      return _handleError(err, req, res);
    } else {
      comment.replies.id(reply.id).remove();
      comment.save(function (_err) {
        if (_err) return _handleError(_err, req, res);
        res.json(200);
      });
    }
  });
});

app.delete('/comment/:id', restrict, privileges('canVoteAndComment'), function (req, res) {
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
      api.comment.remove(comment, function (_err) {
        if (_err) return _handleError(_err, req, res);

        res.json(200);
      });
    }
  });
});

function _handleError (err, req, res) {
  log('Error found: %j', err);
  res.json({ error: err });
}

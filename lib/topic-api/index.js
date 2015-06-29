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
var log = require('debug')('democracyos:topic');
var config = require('lib/config');
var utils = require('lib/utils');
var notifier = require('lib/notifications');

var app = module.exports = express();

/**
 * Limit request to json format only
 */

app.use(accepts('application/json'));

app.get('/topic/all', function (req, res) {
  log('Request /topic/all');

  api.topic.all(req.query.forum, function(err, topicDocs) {
    if (err) return _handleError(err, req, res);

    // filter only public documents
    topicDocs = topicDocs.filter(function(topic) {
      return topic.public || (req.user && req.user.staff)
    });

    // add voted flag to returning documents
    topicDocs.forEach(function(topic) {
      if (!req.user) return topic.voted = false;
      topic.voted = topic.votedBy(req.user);
    });

    log('Serving topics %j', pluck(topicDocs, 'id'));

    var keys = [
      'id topicId mediaTitle status open closed public draft deleted',
      'tag participants voted createdAt updatedAt closingAt',
      'publishedAt deletedAt votable clauseTruncationText links author authorUrl'
    ].join(' ');

    res.json(topicDocs.map(expose(keys)));
  });
});

app.get('/topic/:id', function (req, res) {
  log('Request GET /topic/%s', req.params.id);

  api.topic.get(req.params.id, function (err, topicDoc) {
    if (err) return _handleError(err, req, res);
    if (!topicDoc) return res.send(404);

    log('Serving topic %s', topicDoc.id);
    var keys = [
      'id topicId title mediaTitle summary clauses source status open closed public draft deleted',
      'satus state tag participants',
      'upvotes downvotes abstentions createdAt updatedAt closingAt',
      'publishedAt deletedAt votable clauseTruncationText links author authorUrl'
    ].join(' ');

    res.json(expose(keys)(topicDoc.toJSON()));
  });
});

app.get('/topic/:id/summary-comments', function (req, res) {
  log('Request /topic/%s/summary-comments', req.params.id);

  api.topic.get(req.params.id, function (err) {
    if (err) return _handleError(err, req, res);

    var re = new RegExp(req.params.id + '\-\\d');
    var paging = { page: 0, limit: 0, sort: 'score', exclude_user: null };
    api.comment.getFor({context: 'summary', reference: re}, paging, function (err, comments) {
      if (err) return _handleError(err, req, res);

      log('Serving topic %s summary\'s comments %j', req.params.id, pluck(comments, 'id'));

      var keys = [
        'id text createdAt editedAt context reference',
        'author.id author.fullName author.avatar',
        'flags upvotes downvotes votes replies.length'
      ].join(' ');

      res.json(comments.map(expose(keys)));
    });

  });
});

app.get('/topic/:id/clause-comments', function (req, res) {
  log('Request /topic/%s/clause-comments', req.params.id);

  api.topic.get(req.params.id, function (err, topic) {
    if (err) return _handleError(err, req, res);

    var clauses = topic.clauses.map(function (clause) { return clause.id });
    var paging = { page: 0, limit: 0, sort: 'score', exclude_user: null };
    api.comment.getFor({context: 'clause', reference: { $in: clauses } }, paging, function (err, comments) {
      if (err) return _handleError(err, req, res);

      log('Serving topic %s clauses\' comments %j', req.params.id, pluck(comments, 'id'));

      var keys = [
        'id text createdAt editedAt context reference',
        'author.id author.fullName author.avatar',
        'flags upvotes downvotes votes replies.length'
      ].join(' ');

      res.json(comments.map(expose(keys)));
    });

  });
});

app.get('/topic/:id/comments', function (req, res) {
  log('Request /topic/%s/comments', req.params.id);

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

  api.topic.comments(req.params.id, paging, function (err, comments) {
    if (err) return _handleError(err, req, res);

    if (!req.query.count) {
      log('Serving topic %s comments %j', req.params.id, pluck(comments, 'id'));

      var keys = [
        "id text createdAt editedAt context reference",
        "author.id author.fullName author.avatar",
        "flags upvotes downvotes votes replies.length"
      ].join(' ');

      res.json(comments.map(expose(keys)));
    } else {
      log('Serving topic %s comments count: %d', req.params.id, comments.length);

      res.json(comments.length);
    }
  });
});

app.get('/topic/:id/my-comments', restrict, function (req, res) {
  log('Request /topic/%s/my-comments', req.params.id);

  api.topic.userComments(req.params.id, req.user.id, function (err, comments) {
    if (err) return _handleError(err, req, res);

    log('Serving topic %s comments %j for user %s', req.params.id, pluck(comments, 'id'), req.user.id);

    var keys = [
      "id text createdAt editedAt context reference",
      "author.id author.fullName author.avatar",
      "flags upvotes downvotes votes replies.length"
    ].join(' ');

    res.json(comments.map(expose(keys)));
  });
});

app.post('/topic/:id/comment', restrict, function (req, res) {
  log('Request /topic/%s/comment %j', req.params.id, req.body.comment);

  var comment = {};

  // FIXME: data-structure should be the same for side and regular comments
  // I think the faulty approach is with regular comments - gvilarino 1/16/2015
  if (req.body.comment) {
    // side-comments
    comment = req.body.comment;
  }
  else {
    // regular comments
    comment.text = req.body.text;
    comment.context = 'topic';
    comment.reference = req.params.id;
  }

  // This must be uncommented on production!
  comment.author = req.user.id;

  api.topic.comment(comment, function (err, commentDoc) {
    if (err) return _handleError(err, req, res);

    if (notifier.enabled()) {
      var eventName = 'topic-commented';

      notifier.notify(eventName)
        .withData( { topic: req.params.id, user: req.user.id, comment: commentDoc.id } )
        .send(function (err, data) {
          if (err) {
            log('Error when sending notification for event %s', eventName);
          } else {
            log('Successfully notified voting of topic %s', req.params.id);
          }
        });
    }

    var keys = [
      'id text',
      'author.id author.fullName author.avatar',
      'upvotes downvotes flags',
      'createdAt replies context reference'
    ].join(' ');

    res.json(200, expose(keys)(commentDoc));
  });
});

app.post('/topic/:id/vote', restrict, function (req, res) {
  log('Request /topic/%s/vote', req.param('id'));

  api.topic
  .vote(
    req.param('id'),
    req.user,
    req.param('value'),
    function (err, topic) {
      if (err) return _handleError(err, req, res);

      if (notifier.enabled()) {
        var eventName = 'topic-voted';

        notifier.notify(eventName)
          .withData( { topic: topic.id, user: req.user.id, vote: req.param('value') } )
          .send(function (err, data) {
            if (err) {
              log('Error when sending notification for event %s', eventName);
            } else {
              log('Successfully notified voting of topic %s', topic.id);
            }
          });
      }

      log('Serving 200 OK response');
      res.send(200);
    }
  );
});

app.post('/topic/create', restrict, staff, function (req, res, next) {
  log('Request /topic/create %j', req.body.topic);

  api.topic.create(req.body, function (err, topicDoc) {
    if (err) return next(err);
    var keys = [
      'id topicId title mediaTitle summary clauses source state',
      'status open closed public draft deleted tag participants',
      'upvotes downvotes abstentions createdAt updatedAt closingAt',
      'publishedAt deletedAt votable clauseTruncationText links author authorUrl'
    ].join(' ');
    res.json(expose(keys)(topicDoc));
  });
});

app.post('/topic/:id', restrict, staff, function (req, res) {
  log('Request POST /topic/%s', req.params.id);

  api.topic.update(req.params.id, req.body, function (err, topicDoc) {
    if (err) return _handleError(err, req, res);

    log('Serving topic %s', topicDoc.id);
    var keys = [
      'id topicId title mediaTitle summary clauses source state',
      'status open closed public draft deleted tag participants',
      'upvotes downvotes abstentions createdAt updatedAt closingAt',
      'publishedAt deletedAt votable clauseTruncationText links author authorUrl'
    ].join(' ');

    res.json(expose(keys)(topicDoc.toJSON()));
  });
});

app.post('/topic/:id/clause', restrict, staff, function (req, res) {
  log('Request POST /topic/%s/clause', req.params.id);

  var clause = req.body.clause;
  api.topic.get(req.params.id, function (err, topicDoc) {
    if (err) return _handleError(err, req, res);

    var clauseDoc = clause && clause.id
      ? topicDoc.clauses.id(clause.id)
      : topicDoc.clauses.create();

    clauseDoc.update(clause);
    if (clauseDoc.isNew) topicDoc.clauses.push(clauseDoc);

    topicDoc.save(function (err, saved) {
      if (err) return _handleError(err, req, res);

      res.json(200, expose('id order clauseName text centered')(clauseDoc));
    });
  });
});

app.del('/topic/:id/clause', restrict, staff, function (req, res) {
  log('Request DELETE /topic/%s/clause', req.params.id);

  var clause = req.body.clause;
  api.topic.get(req.params.id, function (err, topicDoc) {
    if (err) return _handleError(err, req, res);

    topicDoc.clauses.remove(clause);
    log('removed clause %s from topic %s', clause, topicDoc.id);

    topicDoc.save(function (err, saved) {
      if (err) return _handleError(err, req, res);

      res.json(200);
    });
  });
});


app.post('/topic/:id/link', restrict, staff, function (req, res) {
  log('Request POST /topic/%s/link', req.params.id);

  var link = req.body.link;
  api.topic.get(req.params.id, function (err, topicDoc) {
    if (err) return _handleError(err, req, res);

    var linkDoc = link && link.id
      ? topicDoc.links.id(link.id)
      : topicDoc.links.create();

    linkDoc.update(link);
    if (linkDoc.isNew) topicDoc.links.push(linkDoc);

    topicDoc.save(function (err, saved) {
      if (err) return _handleError(err, req, res);

      res.json(200, expose('id text url')(linkDoc));
    });
  });
});

app.del('/topic/:id/link', restrict, staff, function (req, res) {
  log('Request DELETE /topic/%s/link', req.params.id);

  var link = req.body.link;
  api.topic.get(req.params.id, function (err, topicDoc) {
    if (err) return _handleError(err, req, res);

    topicDoc.links.remove(link);
    log('removed link %s from topic %s', link, topicDoc.id);

    topicDoc.save(function (err, saved) {
      if (err) return _handleError(err, req, res);

      res.json(200);
    });
  });
});

app.post('/topic/:id/publish', restrict, staff, function (req, res) {
  log('Request POST /topic/%s/publish', req.params.id);

  api.topic.get(req.params.id, function (err, topicDoc) {
    if (err) return _handleError(err, req, res);

    topicDoc.publishedAt = new Date;
    topicDoc.save(function (err, saved) {
      if (err) return _handleError(err, req, res);
      log('publish topic %s at %s', topicDoc.id, topicDoc.publishedAt);

      if (notifier.enabled()) {
        var eventName = 'topic-published';

        var topicUrl = utils.buildUrl(config, { pathname: '/topic/' + topicDoc.id });

        var data = {
          topic: { mediaTitle: topicDoc.mediaTitle, id: topicDoc.id },
          url: topicUrl
        };

        if (config.deploymentId) {
          data.deploymentId = config.deploymentId;
        }

        notifier.notify(eventName)
          .withData(data)
          .send(function (err) {
            if (err) {
              log('Error when sending notification for event %s', eventName);
            } else {
              log('Successfully notified publishing of topic %s', topicDoc.id);
            }
          });
      }

      res.json(200);

    });
  });
});

app.post('/topic/:id/unpublish', restrict, staff, function (req, res) {
  log('Request POST /topic/%s/unpublish', req.params.id);

  api.topic.get(req.params.id, function (err, topicDoc) {
    if (err) return _handleError(err, req, res);

    topicDoc.publishedAt = null;
    topicDoc.save(function (err, saved) {
      if (err) return _handleError(err, req, res);
      log('unpublished topic %s', topicDoc.id);
      res.json(200);
    });
  });
});

app.post('/topic/:id/delete', restrict, staff, function (req, res) {
  log('Request POST /topic/%s/delete', req.params.id);

  api.topic.get(req.params.id, function (err, topicDoc) {
    if (err) return _handleError(err, req, res);

    topicDoc.deletedAt = new Date;
    topicDoc.save(function (err, saved) {
      if (err) return _handleError(err, req, res);
      log('deleted topic %s', topicDoc.id);
      res.json(200);
    });
  });
});

function _handleError (err, req, res) {
  log("Error found: %s", err);
  var error = err;
  if (err.errors && err.errors.text) error = err.errors.text;
  if (error.type) error = error.type;

  res.json(400, { error: error });
}

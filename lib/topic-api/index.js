/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');
var api = require('lib/db-api');
var utils = require('lib/utils');
var accepts = require('lib/accepts');
var restrict = utils.restrict;
var pluck = utils.pluck;
var expose = utils.expose;
var log = require('debug')('democracyos:topic');
var config = require('lib/config');
var utils = require('lib/utils');
var notifier = require('lib/notifications').notifier;
var migrateTopic = require('lib/migrations/topic');
var hasAccess = require('lib/is-owner').hasAccess;

var app = module.exports = express();

/**
 * Limit request to json format only
 */

app.use(accepts('application/json'));

var topicListKeys = [
  'id topicId title mediaTitle status open closed public draft deleted forum',
  'tag participants voted createdAt updatedAt closingAt',
  'publishedAt deletedAt votable clauseTruncationText links author authorUrl'
].join(' ');

var topicKeys = topicListKeys
              + ' '
              + 'summary clauses source state upvotes downvotes abstentions';

function exposeTopic(topicDoc, user, keys) {
  if (!keys) keys = topicKeys;

  var topic = topicDoc.toJSON();
  topic.voted = topicDoc.votedBy(user);

  return expose(keys)(topic);
}

function findForum(req, res, next) {
  if (!config.multiForum) return next();

  if (!mongoose.Types.ObjectId.isValid(req.query.forum)) {
    return _handleError('Must define a valid \'forum\' param.', req, res);
  }

  api.forum.findById(req.query.forum, function(err, forum){
    if (err) return _handleError(err, req, res);
    if (!forum) return _handleError(new Error('Forum not found.'), req, res);

    req.forum = forum;
    next();
  });
}

function onlyForumAdmins(req, res, next) {
  if (!req.user) _handleError(new Error('Unauthorized.'), req, res);

  if (config.multiForum) {
    if (req.forum.isAdmin(req.user)) return next();
    return _handleError(new Error('Unauthorized.'), req, res);
  }

  if (req.user.staff) return next();
  return _handleError(new Error('Unauthorized.'), req, res);
}

app.get('/topic/all',
findForum,
function(req, res, next) {
  if (req.query.draft) {
    onlyForumAdmins(req, res, next);
  } else {
    next();
  }
},
function (req, res) {
  log('Request /topic/all');

  api.topic.all({
    forum: req.forum
  }, function(err, topics) {
    if (err) return _handleError(err, req, res);

    topics = topics.filter(function(topic) {
      if (topic.public) return true;
      if (req.query.draft && topic.draft) return true;
      return false;
    });

    log('Serving topics %j', pluck(topics, 'id'));

    res.json(topics.map(function(topicDoc){
      return exposeTopic(topicDoc, req.user, topicListKeys);
    }));
  });
});

app.get('/topic/:id', function (req, res) {
  log('Request GET /topic/%s', req.params.id);

  api.topic.get(req.params.id, function (err, topic) {
    if (err) return _handleError(err, req, res);
    if (!topic) return res.send(404);
    migrateTopic(topic, function (err, topicMigrated) {
      if (err) {
        return _handleError(err, req, res);
      }

      log('Serving topic %s', topicMigrated.id);
      res.json(exposeTopic(topicMigrated, req.user));
    });
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

      res.json(exposeTopic(topic, req.user));
    }
  );
});

app.post('/topic/create', restrict, hasAccess, function (req, res, next) {
  log('Request /topic/create %j', req.body);

  req.body.forum = req.forum;
  api.topic.create(req.body, function (err, topic) {
    if (err) return next(err);
    var keys = [
      'id topicId title mediaTitle body clauses source state',
      'status open closed public draft deleted tag participants',
      'upvotes downvotes abstentions createdAt updatedAt closingAt',
      'publishedAt deletedAt votable bodyTruncationText links author authorUrl'
    ].join(' ');
    res.json(exposeTopic(topic, req.user));
  });
});

app.post('/topic/:id', restrict, hasAccess, function (req, res) {
  log('Request POST /topic/%s', req.params.id);

  api.topic.update(req.params.id, req.body, function (err, topic) {
    if (err) return _handleError(err, req, res);
    log('Serving topic %s', topic.id);
    res.json(exposeTopic(topic, req.user));
  });
});

app.post('/topic/:id/link', restrict, hasAccess, function (req, res) {
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

app.delete('/topic/:id/link', restrict, hasAccess, function (req, res) {
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

app.post('/topic/:id/publish', restrict, hasAccess, function (req, res) {
  log('Request POST /topic/%s/publish', req.params.id);

  api.topic.get(req.params.id, function (err, topic) {
    if (err) return _handleError(err, req, res);

    topic.publishedAt = new Date;
    topic.save(function (err, saved) {
      if (err) return _handleError(err, req, res);
      log('publish topic %s at %s', topic.id, topic.publishedAt);

      var eventName = 'topic-published';

      var topicUrl = utils.buildUrl(config, { pathname: '/topic/' + topic.id });

      var data = {
        topic: { mediaTitle: topic.mediaTitle, id: topic.id },
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
            log('Successfully notified publishing of topic %s', topic.id);
          }
        });
    });

    res.json(exposeTopic(topic, req.user));
  });
});

app.post('/topic/:id/unpublish', restrict, hasAccess, function (req, res) {
  log('Request POST /topic/%s/unpublish', req.params.id);

  api.topic.get(req.params.id, function (err, topicDoc) {
    if (err) return _handleError(err, req, res);

    topicDoc.publishedAt = null;
    topicDoc.save(function (err, saved) {
      if (err) return _handleError(err, req, res);
      log('unpublished topic %s', topicDoc.id);
      res.json(exposeTopic(topicDoc, req.user));
    });
  });
});

app.delete('/topic/:id', restrict, hasAccess, function (req, res) {
  log('Request DEL /topic/%s', req.params.id);

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

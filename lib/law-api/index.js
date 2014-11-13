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

    // filter only public documents
    lawDocs = lawDocs.filter(function(law) {
      return law.public || (req.user && req.user.staff)
    });

    // add voted flag to returning documents
    lawDocs.forEach(function(law) {
      if (!req.user) return law.voted = false;
      law.voted = law.votedBy(req.user);
    });

    log('Serving laws %j', pluck(lawDocs, "id"));

    var keys = [
      'id lawId mediaTitle status open closed public draft deleted',
      'tag participants voted createdAt updatedAt closingAt',
      'publishedAt deletedAt votable clauseTruncationText links author authorUrl'
    ].join(' ');

    res.json(lawDocs.map(expose(keys)));
  });
});

app.get('/law/:id', function (req, res) {
  log('Request GET /law/%s', req.params.id);

  api.law.get(req.params.id, function (err, lawDoc) {
    if (err) return _handleError(err, req, res);
    if (!lawDoc) return res.send(404);

    log('Serving law %s', lawDoc.id);
    var keys = [
      'id lawId title mediaTitle summary clauses source status open closed public draft deleted',
      'satus state tag participants',
      'upvotes downvotes abstentions createdAt updatedAt closingAt',
      'publishedAt deletedAt votable clauseTruncationText links author authorUrl'
    ].join(' ');

    res.json(expose(keys)(lawDoc.toJSON()));
  });
});

app.get('/law/:id/summary-comments', function (req, res) {
  log('Request /law/%s/summary-comments', req.params.id);

  api.law.get(req.params.id, function (err, law) {
    if (err) return _handleError(err, req, res);

    var re = new RegExp(req.params.id + '\-\\d');
    api.comment.getFor({context: 'summary', reference: re}, null, function (err, comments) {
      if (err) return _handleError(err, req, res);

      log('Serving law %s summary\'s comments %j', req.params.id, pluck(comments, 'id'));

      var keys = [
        'id text createdAt editedAt context reference',
        'author.id author.fullName author.gravatar() author.profilePictureUrl',
        'flags upvotes downvotes votes replies.length'
      ].join(' ');

      res.json(comments.map(expose(keys)));
    });

  });
});

app.get('/law/:id/clause-comments', function (req, res) {
  log('Request /law/%s/clause-comments', req.params.id);

  api.law.get(req.params.id, function (err, law) {
    if (err) return _handleError(err, req, res);

    var clauses = law.clauses.map(function (clause) { return clause.id });

    api.comment.getFor({context: 'clause', reference: { $in: clauses } }, null, function (err, comments) {
      if (err) return _handleError(err, req, res);

      log('Serving law %s clauses\' comments %j', req.params.id, pluck(comments, 'id'));

      var keys = [
        'id text createdAt editedAt context reference',
        'author.id author.fullName author.gravatar() author.profilePictureUrl',
        'flags upvotes downvotes votes replies.length'
      ].join(' ');

      res.json(comments.map(expose(keys)));
    });

  });
});

app.get('/law/:id/comments', function (req, res) {
  log('Request /law/%s/comments', req.params.id);

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

  api.law.comments(req.params.id, paging, function (err, comments) {
    if (err) return _handleError(err, req, res);

    if (!req.query.count) {
      log('Serving law %s comments %j', req.params.id, pluck(comments, 'id'));

      var keys = [
        "id text createdAt editedAt context reference",
        "author.id author.fullName author.gravatar() author.profilePictureUrl",
        "flags upvotes downvotes votes replies.length"
      ].join(' ');

      res.json(comments.map(expose(keys)));
    } else {
      log('Serving law %s comments count: %d', req.params.id, comments.length);

      res.json(comments.length);
    }
  });
});

app.get('/law/:id/my-comments', restrict, function (req, res) {
  log('Request /law/%s/my-comments', req.params.id);

  api.law.citizenComments(req.params.id, req.user.id, function (err, comments) {
    if (err) return _handleError(err, req, res);

    log('Serving law %s comments %j for citizen %s', req.params.id, pluck(comments, 'id'), req.user.id);

    var keys = [
      "id text createdAt editedAt context reference",
      "author.id author.fullName author.gravatar() author.profilePictureUrl",
      "flags upvotes downvotes votes replies.length"
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
      'author.id author.fullName author.gravatar() author.profilePictureUrl',
      'upvotes downvotes flags',
      'createdAt replies context reference'
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
      'id lawId title mediaTitle summary clauses source state',
      'status open closed public draft deleted tag participants',
      'upvotes downvotes abstentions createdAt updatedAt closingAt',
      'publishedAt deletedAt votable clauseTruncationText links author authorUrl'
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
      'id lawId title mediaTitle summary clauses source state',
      'status open closed public draft deleted tag participants',
      'upvotes downvotes abstentions createdAt updatedAt closingAt',
      'publishedAt deletedAt votable clauseTruncationText links author authorUrl'
    ].join(' ');

    res.json(expose(keys)(lawDoc.toJSON()));
  });
});

app.post('/law/:id/clause', restrict, staff, function (req, res) {
  log('Request POST /law/%s/clause', req.params.id);

  var clause = req.body.clause;
  api.law.get(req.params.id, function (err, lawDoc) {
    if (err) return _handleError(err, req, res);

    var clauseDoc = clause && clause.id
      ? lawDoc.clauses.id(clause.id)
      : lawDoc.clauses.create();

    clauseDoc.update(clause);
    if (clauseDoc.isNew) lawDoc.clauses.push(clauseDoc);

    lawDoc.save(function (err, saved) {
      if (err) return _handleError(err, req, res);

      res.json(200, expose('id order clauseName text centered')(clauseDoc));
    });
  });
});

app.del('/law/:id/clause', restrict, staff, function (req, res) {
  log('Request DELETE /law/%s/clause', req.params.id);

  var clause = req.body.clause;
  api.law.get(req.params.id, function (err, lawDoc) {
    if (err) return _handleError(err, req, res);

    lawDoc.clauses.remove(clause);
    log('removed clause %s from law %s', clause, lawDoc.id);

    lawDoc.save(function (err, saved) {
      if (err) return _handleError(err, req, res);

      res.json(200);
    });
  });
});


app.post('/law/:id/link', restrict, staff, function (req, res) {
  log('Request POST /law/%s/link', req.params.id);

  var link = req.body.link;
  api.law.get(req.params.id, function (err, lawDoc) {
    if (err) return _handleError(err, req, res);

    var linkDoc = link && link.id
      ? lawDoc.links.id(link.id)
      : lawDoc.links.create();

    linkDoc.update(link);
    if (linkDoc.isNew) lawDoc.links.push(linkDoc);

    lawDoc.save(function (err, saved) {
      if (err) return _handleError(err, req, res);

      res.json(200, expose('id text url')(linkDoc));
    });
  });
});

app.del('/law/:id/link', restrict, staff, function (req, res) {
  log('Request DELETE /law/%s/link', req.params.id);

  var link = req.body.link;
  api.law.get(req.params.id, function (err, lawDoc) {
    if (err) return _handleError(err, req, res);

    lawDoc.links.remove(link);
    log('removed link %s from law %s', link, lawDoc.id);

    lawDoc.save(function (err, saved) {
      if (err) return _handleError(err, req, res);

      res.json(200);
    });
  });
});

app.post('/law/:id/publish', restrict, staff, function (req, res) {
  log('Request POST /law/%s/publish', req.params.id);

  api.law.get(req.params.id, function (err, lawDoc) {
    if (err) return _handleError(err, req, res);

    lawDoc.publishedAt = new Date;
    lawDoc.save(function (err, saved) {
      if (err) return _handleError(err, req, res);
      log('publish law %s at %s', lawDoc.id, lawDoc.publishedAt);
      res.json(200);
    });
  });
});

app.post('/law/:id/unpublish', restrict, staff, function (req, res) {
  log('Request POST /law/%s/unpublish', req.params.id);

  api.law.get(req.params.id, function (err, lawDoc) {
    if (err) return _handleError(err, req, res);

    lawDoc.publishedAt = null;
    lawDoc.save(function (err, saved) {
      if (err) return _handleError(err, req, res);
      log('unpublished law %s', lawDoc.id);
      res.json(200);
    });
  });
});

app.post('/law/:id/delete', restrict, staff, function (req, res) {
  log('Request POST /law/%s/delete', req.params.id);

  api.law.get(req.params.id, function (err, lawDoc) {
    if (err) return _handleError(err, req, res);

    lawDoc.deletedAt = new Date;
    lawDoc.save(function (err, saved) {
      if (err) return _handleError(err, req, res);
      log('deleted law %s', lawDoc.id);
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
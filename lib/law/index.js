/**
 * Module dependencies.
 */

var express = require('express')
  , restrict = require('lib/utils').restrict
  , api = require('lib/db-api')
  , log = require('debug')('law');

var app = module.exports = express();

app.get('/law/all', function (req, res) {
  log('Request /law/all');

  api.law.all(function(err, lawDocs) {
    if (err) return _handleError(err, req, res);

    log('Serving laws %j', lawDocs);
    res.json(lawDocs);
  });
});

app.get('/law/:id', function (req, res) {
  log('Request /law/%s', req.params.id);

  api.law.get(req.params.id, function (err, lawDoc) {
    if (err) return _handleError(err, req, res);
  
    log('Serving law %j', lawDoc);
    res.json(lawDoc);
  });
});

app.get('/law/:id/comments', function (req, res) {
  log('Request /law/%s', req.params.id);

  api.law.comments(req.params.id, function (err, comments) {
    if (err) return _handleError(err, req, res);
  
    log('Serving law %s comments %j', req.params.id, comments);
    res.json(comments);
  });
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
        log('Serving proposal %j', lawDoc);
        res.json(lawDoc);
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
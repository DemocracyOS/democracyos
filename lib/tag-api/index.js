/**
 * Module dependencies.
 */

var express = require('express')
  , db = require('lib/tag')
  , log = require('debug')('tag:api');


var app = module.exports = express();


app.get('/tag/search', function (req, res) {
  log('Request /tag/search %j', req.query);
  db.search(req.query.q, function(err, tags) {
    if (err) return _handleError(err, req, res);

    log('Serving tags %j', tags);
    res.json(tags);
  })
});

app.post('/tag/create', function(req, res) {
  log('Request /tag/create %j', req.body.tag);
  db.create(req.body.tag, function(err, tag) {
    if (err) return _handleError(err, req, res);

    log('Serving tag %j', tag);
    res.json(tag);
  });
});

function _handleError (err, req, res) {
  log("Error found: %j", err);

  res.json({ error: err });
}
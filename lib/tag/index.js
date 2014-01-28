/**
 * Module dependencies.
 */

var express = require('express');
var api = require('lib/db-api');
var accepts = require('lib/accepts');
var log = require('debug')('democracyos:tag');


var app = module.exports = express();

/**
 * Limit request to json format only
 */

app.use(accepts('application/json'));

app.get('/tag/search', function (req, res) {
  log('Request /tag/search %j', req.query);
  api.tag.search(req.query.q, function(err, tags) {
    if (err) return _handleError(err, req, res);

    log('Serving tags %j', tags);
    res.json(tags.map(expose('id hash name color createdAt')));
  })
});

app.post('/tag/create', function(req, res) {
  log('Request /tag/create %j', req.body.tag);
  api.tag.create(req.body.tag, function(err, tag) {
    if (err) return _handleError(err, req, res);

    log('Serving tag %j', tag);
    res.json(expose('id hash name color createdAt')(tag));
  });
});

function _handleError (err, req, res) {
  log("Error found: %j", err);
  res.json({ error: err });
}
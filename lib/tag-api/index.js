/**
 * Module dependencies.
 */

var express = require('express')
  , db = require('lib/tag')
  , log = require('debug')('tag:api');


var app = module.exports = express();


app.get('/tag/search', function (req, res) {
  log('query received %j', req.query);
  db.search(req.query, function(err, tags) {
    // should handle error differently!!
    log('retrieving tags %j', tags);
    res.json(tags);
  })
});

app.post('/tag/create', function(req, res) {
  console.log(req.body);
  log('creating tag %j', req.body.tag);
  db.create(req.body.tag, function(err, tag) {
    log('created tag %j', tag);
    res.json(tag);
  });
});
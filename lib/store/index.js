/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express();
var log = require('debug')('democracyos:store');

app.post('/session/:key', function(req, res, next) {
  var key = req.params.key;
  var data = req.body;

  log('write %s with %j', key, data);
  req.session[key] = data;

  res.send(200);
});

app.get('/session/:key', function(req, res, next) {
  var key = req.params.key;

  log("read %s", key);
  var data = req.session[key];

  log('serve %s with %j', key, data);
  res.json(200, data || {});
});
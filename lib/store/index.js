/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express();
var log = require('debug')('democracyos:store');

app.post('/session/:key', function(req, res, next) {
  var key = req.params.key;
  var data = req.body;

  log('write %s with %s', key, data);

  req.session = req.session || {};
  req.session[key] = data;

  res.send(200);
});

app.get('/session/:key', function(req, res, next) {
  var key = req.params.key;

  log('read %s', key);

  req.session = req.session || {};
  var data = req.session[key];

  log('serve %s with %j', key, data);
  res.json(200, data || {});
});

app.delete('/session/:key', function(req, res, next) {
  var key = req.params.key;

  log('delete %s', key);

  req.session = req.session || {};
  req.session[key] = null;

  res.send(200);
});

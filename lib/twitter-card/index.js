var express = require('express');
var app = module.exports = express();
var api = require('lib/db-api');
var config = require('lib/config');
var path = require('path');
var resolve = path.resolve;
var strip = require('strip');
var log = require('debug')('democracyos:twitter-card');

app.get('/law/:id', function(req, res, next){    
  log('Twitter Request /law/%s', req.params.id);
  api.law.get(req.params.id, function (err, lawDoc) {
    if (err) return _handleError(err, req, res);
    log('Serving Twitter law %s', lawDoc.id);
    res.render(resolve(__dirname, 'law.jade'), { law: lawDoc, config : config, strip: strip });
  });
})

app.get('*', function(req, res, next){    
  log('Twitter Request generic page');
  res.render(resolve(__dirname, 'generic.jade'), {config : config});
})
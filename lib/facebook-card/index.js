var express = require('express');
var app = module.exports = express();
var api = require('lib/db-api');
var config = require('lib/config');
var path = require('path');
var url = require('url');
var resolve = path.resolve;
var strip = require('strip');
var log = require('debug')('democracyos:facebook-card');

app.get('/topic/:id', function(req, res, next){
  log('Facebook Request /topic/%s', req.params.id);
  api.topic.get(req.params.id, function (err, topicDoc) {
    if (err) return _handleError(err, req, res);
    log('Serving Facebook topic %s', topicDoc.id);
    var baseUrl = url.format({
        protocol: config.protocol
      , hostname: config.host
      , port: config.publicPort
    });
    res.render(resolve(__dirname, 'topic.jade'),
                       { topic: topicDoc,
                         baseUrl : baseUrl,
                         config : config,
                         strip: strip
                       });
  });
})

app.get('*', function(req, res, next){
  log('Facebook Request generic page');
  var baseUrl = url.format({
      protocol: config.protocol
    , hostname: config.host
    , port: config.publicPort
  });
  res.render(resolve(__dirname, 'generic.jade'),
                     { baseUrl : baseUrl,
                      config : config});
})
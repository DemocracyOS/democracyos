var express = require('express');
var app = module.exports = express();
var api = require('lib/db-api');
var config = require('lib/config');
var path = require('path');
var url = require('url');
var resolve = path.resolve;
var strip = require('strip');
var log = require('debug')('democracyos:facebook-card');

app.get('/law/:id', function(req, res, next){    
  log('Facebook Request /law/%s', req.params.id);
  api.law.get(req.params.id, function (err, lawDoc) {
    if (err) return _handleError(err, req, res);
    log('Serving Facebook law %s', lawDoc.id);
    var baseUrl = url.format({
        protocol: config('protocol')
      , hostname: config('host')
      , port: config('publicPort')
    });
    res.render(resolve(__dirname, 'law.jade'),
                       { law: lawDoc,
                         baseUrl : baseUrl,
                         config : config,
                         strip: strip
                       });
  });
})

app.get('*', function(req, res, next){    
  log('Facebook Request generic page');
  var baseUrl = url.format({
      protocol: config('protocol')
    , hostname: config('host')
    , port: config('publicPort')
  });
  res.render(resolve(__dirname, 'generic.jade'),
                     { baseUrl : baseUrl,
                      config : config});
})
/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
var url = require('url');
var config = require('lib/config');
var api = require('lib/db-api');
var sorts = require('lib/laws-filter');
var utils = require('lib/utils');
var resolve = path.resolve;
var expose = utils.expose;
var pluck = utils.pluck;
var sorts = require('lib/laws-filter').sorts;
var log = require('debug')('democracyos:rss')

/**
 * Lazy register Forgot Password Application
 */

var app;

/**
 * Exports Application
 */

module.exports = app = express();


/**
 * Define routes for RSS feed module
 */

app.get('/', function(req, res, next) {
  if (!config('rss enabled')) {
    log('rss feed not enabled')
    return res.send(404);
  }

  api.law.rss(function (err, laws) {
    if (err) return _handleError(err, req, res);

    // filter only public documents
    laws = laws.filter(function(law) {
      return law.public;
    });

    log('Serving laws %j', pluck(laws, "id"));

    var keys = [
      'id lawId mediaTitle publishedAt summary',
    ].join(' ');


    var baseUrl = url.format({
        protocol: config('protocol')
      , hostname: config('host')
      , port: config('publicPort')
    });

    laws = laws.sort(sorts['newest-first'].sort);

    res.set('Content-Type', 'application/xml');
    return res.render(resolve(__dirname, 'rss.jade'),
      { 
        laws: laws.map(expose(keys)),
        baseUrl: baseUrl,
        config: config
      }
    );
  });
});

function _handleError (err, req, res) {
  log("Error found: %s", err);
  var error = err;
  if (err.errors && err.errors.text) error = err.errors.text;
  if (error.type) error = error.type;

  res.json(400, { error: error });
}
/**
 * Module dependencies.
 */

var http = require('http');
var app = module.exports = require('lib/boot');
var server = http.createServer(app);
var balance = require('lib/balance');
var config = require('lib/config');
var log = require('debug')('democracyos:root');

/**
 * Launch the server
 */

if (module === require.main) {
  balance(function() {
    server.listen(config('privatePort'), function() {
      log('Application started on port %d', config('privatePort'));
    });
  });
}
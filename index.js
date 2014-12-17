/**
 * Module dependencies.
 */

var app = module.exports = require('lib/boot');
var fs = require('fs');
var http = require('http');
var https = require('https');
var balance = require('lib/balance');
var config = require('lib/config');
var log = require('debug')('democracyos:root');
var ssl = config('ssl');
var port = ssl ? config('securePort') : config('privatePort');

var server;

if (ssl) {
  // config('serverKey') = 'server.key'
  // config('serverCert') = 'server.crt'
  var privateKey = fs.readFileSync(config('serverKey'), 'utf-8');
  var certificate = fs.readFileSync(config('serverCert'), 'utf-8');
  var credentials = { key: privateKey, cert: certificate };
  server = https.createServer(credentials, app);
} else {
  server = http.createServer(app);
}

/**
 * Launch the server
 */

if (module === require.main) {
  balance(function() {
    server.listen(port, function() {
      log('Application started on port %d', port);
    });
  });
}
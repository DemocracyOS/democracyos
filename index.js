/**
 * Module dependencies.
 */

var app = module.exports = require('lib/boot');
var http = require('http');
var https = require('https');
var balance = require('lib/balance');
var config = require('lib/config');
var fs = require('fs');
var log = require('debug')('democracyos:root');

var protocol = config('protocol');
var ssl = config('ssl');
var secure = 'https' === protocol;

/**
 * Configure standard server
 */
var server = http.createServer(app);

/**
 * Configure secure server (SSL) if necessary
 */

var secureServer;
if (secure) {
  var privateKey = fs.readFileSync(ssl.serverKey, 'utf-8');
  var certificate = fs.readFileSync(ssl.serverCert, 'utf-8');
  var credentials = { key: privateKey, cert: certificate };
  secureServer = https.createServer(credentials, app);
}

/**
 * Launch the servers
 */

if (module === require.main) {
  balance(function() {
    server.listen(config('privatePort'), function() {
      log('Application started on port %d', config('privatePort'));
    });

    if (secure) {
      secureServer.listen(ssl.port, function() {
        log('Secure application started on port %d', ssl.port);
      });
    }
  });
}
/**
 * Module dependencies.
 */

var app = module.exports = require('lib/boot');
var fs = require('fs');
var http = require('http');
var https = require('https');
var balance = require('lib/balance');
var config = require('lib/config');
var protocol = config('protocol');
var ssl = config('ssl');
var exists = fs.existsSync;
var log = require('debug')('democracyos:root');

var secure = 'https' === protocol;
var serverKey = ssl.dir + '/' + ssl.serverKey;
var serverCert = ssl.dir + '/' + ssl.serverCert;
var port = secure ? ssl.port : config('privatePort');
var server;

if (secure) {
  var privateKey = fs.readFileSync(serverKey, 'utf-8');
  var certificate = fs.readFileSync(serverCert, 'utf-8');
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
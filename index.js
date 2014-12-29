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
var exec = require('child_process').exec;
var exists = fs.existsSync;
var log = require('debug')('democracyos:root');

var secure = protocol === 'https';
var port = secure ? ssl.port : config('privatePort');
var server;

function startSsl() {
  var privateKey = fs.readFileSync(ssl.serverKey, 'utf-8');
  var certificate = fs.readFileSync(ssl.serverCert, 'utf-8');
  var credentials = { key: privateKey, cert: certificate };
  server = https.createServer(credentials, app);
}

if (secure) {

  if (!exists(ssl.serverCert) || !exists(ssl.serverKey)) {
    exec('openssl genrsa 1024 > server.key', function(err, stdout, stderr) {
      if (stdout.length) console.log(stdout);
      //if (stderr.length) return console.log('stderr: ' + stderr), process.exit(1);
      if (err != null) return console.log('Exception: ' + err), process.exit(1);

      exec('openssl req -new -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=www.example.com" -key server.key -out csr.pem', function(err, stdout, stderr) {
        if (stdout.length) console.log(stdout);
        if (stderr.length) return console.log(stderr), process.exit(1);
        if (err != null) return console.log(err), process.exit(1);

        exec('openssl x509 -req -days 365 -in csr.pem -signkey server.key -out server.crt', function(err, stdout, stderr) {
          if (stdout.length) console.log(stdout);
          if (stderr.length) return console.log(stderr), process.exit(1);
          if (err != null) return console.log(err), process.exit(1);

          startSsl();
        });
      });
    });
  } else {
    startSsl();
  }
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
var config = require('lib/config');
var app = require('lib/boot');
var serverFactory = require('lib/server-factory');
var log = require('debug')('democracyos:root');


/**
 * Module export
 */

module.exports = app;


/**
 * Launch the server(s)!
 */

var servers = serverFactory(app, {
  port: process.env.PORT || config.publicPort,
  protocol: config.protocol,
  https: config.https
});

if (module === require.main){
  servers.forEach(function listen(server) {
    server.listen(function(){
      log('Server started at port %s.', server.port);
    });
  });
}
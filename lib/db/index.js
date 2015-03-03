/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var log = require('debug')('democracyos:db');

/**
 * Connects to the databse and returns the connection
 * @param  {string} uri mongoDB-compliant connection URI
 * @param  {Object} opts additional options:
 *                       createConnection {Boolean|false} connect to a database that's not the default one
 *                       rsName {String|'rs0'} replica set name
 *                       verbose {Boolean|false} log mongoose connection status verbosely
 * @return {Mixed} new connection if createConnection is true, `mongoose` instance otherwise
 */
exports.connect = function connect (uri, opts) {
  opts = opts || { createConnection: false, rsName: 'rs0', verbose: false };

  var dbOptions = defaultOptions();

  // Is it a replica set connection string?
  if (!!~uri.indexOf(',')) {

    dbOptions.db.w = 'majority';

    dbOptions.replSet = {
      haInterval: 500,
      reconnectWait: 5000,
      poolSize: 5,
      retries: 10000000,
      readPreference: 'secondaryPreferred',
      rs_name: opts.rsName,
      socketOptions: {
        connectTimeoutMS: 5000,
        keepAlive: 1
      }
    }
  };

  setupListeners(uri, opts.verbose);

  return opts.createConnection ? mongoose.createConnection(uri, dbOptions) : mongoose.connect(uri, dbOptions);
};

function defaultOptions() {
  return {
    db: {
      journal: true,
      retryMiliSeconds: 5000,
      numberOfRetries: Number.MAX_VALUE,
      readPreference: 'secondaryPreferred'
    },
    auto_reconnect: true,
    server: {
      poolSize: 5,
      auto_reconnect: true,
      socketOptions: {
        connectTimeoutMS: 5000,
        keepAlive: 1
      }
    }
  };
}

function setupListeners(uri, verbose) {
  mongoose.connection.on('error', function (err) {
    log('ERROR: in mongoose connection %s : %s', uri, err);
  });

  mongoose.connection.on('disconnected', function (err) {
    log('WARNING: mongoose disconnected from %s - Error: %s', uri, err);
  });

  if (verbose) {
    mongoose.connection.on('reconnect', function() {
      log('Mongoose reconnecting to %s', uri);
    });

    mongoose.connection.on('connected', function() {
      log('Mongoose connected to %s', uri);
    });

    mongoose.connection.on('connecting', function() {
      log('Mongoose connecting to %s', uri);
    });

    mongoose.connection.on('open', function() {
      log('Mongoose connection open to %s', uri);
    });
  }
};

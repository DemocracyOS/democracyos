var mongoose = require('mongoose');

exports.connect = function connect (dbid, opts) {

  if (/mongoose|^\*$/.test(process.env.DEBUG)) {
    mongoose.set('debug', true);
  }

  var dbOptions = {
    db: {
      journal: true,
      retryMiliSeconds: 5000,
      numberOfRetries: 1000000,
      read_preference: 'secondaryPreferred'
    },
    auto_reconnect: true,
    server: {
      poolSize: parseInt(process.env.MONGO_POOL_SIZE || 5, 10),
      auto_reconnect: true,
      socketOptions: {
        connectTimeoutMS: 20000,
        keepAlive: 1
      }
    }
  };

  var uri = [];

  if (opts.cluster) {
    var nodes = opts.cluster.split(',');
    console.log('Using mongodb cluster: ' + nodes);

    for (var index = 0; index < nodes.length; index++) {
      uri.push('mongodb://' + nodes[index]);
      if (index === 0) {
        uri.push('/');
        uri.push(opts.dbname);
      }

      if (index + 1 < nodes.length) {
        uri.push(',');
      }
    }

    uri = uri.join('');

    console.log(uri);

    dbOptions.db.w = 'majority';

    dbOptions.server.slaveOk = true;

    dbOptions.replset = {
      haInterval: 500,
      reconnectWait: 5000,
      poolSize: parseInt(process.env.MONGO_POOL_SIZE || 5, 10),
      retries: 10000000,
      readPreference: 'secondaryPreferred',
      rs_name: opts.replSetName || 'SOFICOM',
      slaveOk: true,
      socketOptions: {
        connectTimeoutMS: 20000,
        keepAlive: 1
      }
    };

  }else {
    uri = 'mongodb://' + process.env.MONGO_HOST + ':' +
        (process.env.MONGO_PORT || 27017) + '/' + opts.dbname;
  }

  if (opts.mongoUser && opts.mongoPassword) {
    dbOptions.user = opts.mongoUser;
    dbOptions.pass = opts.mongoPassword;
  }

  mongoose.connection.on('error', function(err) {
    console.log('mongo ' + uri + ' error: ');
    console.log(err);
  });

  mongoose.connection.on('reconnect', function() {
    console.log('reconectando conexiÃ³n a mongodb');
  });

  mongoose.connection.on('connected', function() {
    console.log('mongo ' + uri + ' connected');
  });

  mongoose.connection.on('connecting', function() {
    console.log('Conectando a la base de datos del sistema ' + opts.dbname);
  });

  mongoose.connection.on('disconnected', function(err) {
    console.log('mongo ' + uri + ' disconnected');
  });

  mongoose.connection.on('open', function() {
    console.log('ConexiÃ³n a Mongo realizada.');
  });

  if ('data' == dbid) {
    mongoose.connect(uri, dbOptions);
  } else if ('users' == dbid) {
    mongoose.createConnection(uri, dbOptions);
  } else {
    throw new Error('ZOMG DATABASE EXPLODING');
  }

  return mongoose;
}


// /**
//  * Module dependencies.
//  */

// var mongoose = require('mongoose');
// var log = require('debug')('democracyos:db');
// var count = 0;
// var muri = require('muri');

// /**
//  * Connects to the databse and returns the connection
//  * @param  {string} uri mongoDB-compliant connection URI
//  * @param  {Object} opts additional options:
//  *                       createConnection {Boolean|false} connect to a database that's not the default one
//  *                       rsName {String|'rs0'} replica set name
//  *                       verbose {Boolean|false} log mongoose connection status verbosely
//  * @return {Mixed} new connection if createConnection is true, `mongoose` instance otherwise
//  */
// exports.connect = function connect (uri, opts) {
//   opts = opts || {}
//   opts.createConnection = opts.createConnection || false;
//   // opts.rsName = opts.rsName || 'rs0';
//   opts.verbose = opts.verbose ||  false;

//   opts.verbose = true;

//   uriObj = muri(uri);

//   if (opts.verbose) log('Initial mongo URI and options (from muri): %j', uriObj);

//   uriObj.options = uriObj.options || {};

//   var dbOptions = defaultDbOptions(uriObj.options);

//   if (opts.verbose) log('Mongo URI and options after defaults (FROM MURI): %j', uriObj);
//   if (opts.verbose) log('Mongo URI and options after defaults: %j', uriObj);

//   if (isReplSet(uri)) {
//     if (opts.verbose) log('MongoDB connection string points to replicaset \'%s\'; adapting connection options', dbOptions.replicaSet);

//     // dbOptions.db.w = 'majority';

//     dbOptions.replSet = dbOptions.replSet || {};

//     dbOptions.replSet.haInterval = 500;
//     dbOptions.replSet.reconnectWait = 5000;
//     dbOptions.replSet.poolSize = 5;
//     dbOptions.replSet.retries = 100000;
//     dbOptions.replSet.readPreference = 'primaryPreferred';

//     dbOptions.replSet.socketOptions = dbOptions.replSet.socketOptions || {};
//     dbOptions.replSet.socketOptions.connectTimeoutMS = 10000;
//     dbOptions.replSet.socketOptions.keepAlive = 1;

//     // dbOptions.replSet = {
//     //   haInterval: 500,
//     //   reconnectWait: 5000,
//     //   poolSize: 5,
//     //   retries: 1000000,
//     //   readPreference: 'secondaryPreferred',
//     //   // rs_name: opts.rsName,
//     //   socketOptions: {
//     //     connectTimeoutMS: 10000,
//     //     keepAlive: 1
//     //   }
//     // }
//   };

//   setupListeners(uri, opts.verbose);

//   count++;

//   // if (opts.verbose)
//   log('Attempting connection #%s to MongoDB on URI %s with options %j', count, uri, dbOptions);

//   return opts.createConnection ? mongoose.createConnection(uri, dbOptions) : mongoose.connect(uri, dbOptions);
// };

// function defaultDbOptions(opts) {
//   // return {
//     //db
//     opts.db = opts.db || {};
//     opts.db.journal = true;
//     opts.db.retryMiliSeconds = 5000;
//     opts.db.numberOfRetries = 10000;
//     opts.db.readPreference = 'primaryPreferred';

//     //reconnect
//     opts.auto_reconnect = true;

//     //server
//     opts.server = opts.server || {};
//     opts.server.poolSize = 5;
//     opts.server.auto_reconnect = true;

//     opts.socketOptions = opts.socketOptions || {};
//     opts.socketOptions.connectTimeoutMS = 10000;
//     opts.socketOptions.keepAlive = 1;

//     // db: {
//     //   journal: true,
//     //   retryMiliSeconds: 5000,
//     //   numberOfRetries: 100000,
//     //   readPreference: 'secondaryPreferred'
//     // },
//     // auto_reconnect: true,
//     // server: {
//     //   poolSize: 5,
//     //   auto_reconnect: true,
//     //   socketOptions: {
//     //     connectTimeoutMS: 5000,
//     //     keepAlive: 1
//     //   }
//     // }
//   // };
//   return opts;
// }

// function setupListeners(uri, verbose) {
//   mongoose.connection.on('error', function (err) {
//     log('ERROR: in mongoose connection %s : %s', uri, err);
//   });

//   mongoose.connection.on('disconnected', function (err) {
//     log('WARNING: mongoose disconnected from %s - Error: %s', uri, err);
//   });

//   if (verbose) {
//     mongoose.connection.on('reconnect', function() {
//       log('Mongoose reconnecting to %s', uri);
//     });

//     mongoose.connection.on('connected', function() {
//       log('Mongoose connected to %s', uri);
//     });

//     mongoose.connection.on('connecting', function() {
//       log('Mongoose connecting to %s', uri);
//     });

//     mongoose.connection.on('open', function() {
//       log('Mongoose connection open to %s', uri);
//     });
//   }
// };

// function isReplSet(uri) {
//   // TODO: use regexp
//   return uri && ~uri.indexOf(',');
// };

var mongoose = require('mongoose');
var log = require('debug')('democracyos:db');

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
    log('Using mongodb cluster: %s', nodes);

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

    log('Using mongodb URI: %s', uri);

    // TODO: according to docs, this defaults to '1'
    // dbOptions.db.w = 'majority';

    dbOptions.server.slaveOk = true;

    dbOptions.replset = {
      haInterval: 500,
      reconnectWait: 5000,
      poolSize: parseInt(process.env.MONGO_POOL_SIZE || 5, 10),
      retries: 10000000,
      readPreference: 'secondaryPreferred',
      rs_name: opts.replSetName || 'rs0',
      slaveOk: true,
      socketOptions: {
        connectTimeoutMS: 20000,
        keepAlive: 1
      }
    };

  } else {
    uri = 'mongodb://' + process.env.MONGO_HOST + ':' +
        (process.env.MONGO_PORT || 27017) + '/' + opts.dbname;
  }

  if (opts.mongoUser && opts.mongoPassword) {
    dbOptions.user = opts.mongoUser;
    dbOptions.pass = opts.mongoPassword;
  }

  mongoose.connection.on('error', function(err) {
    log('mongo %s error: %s', uri, err);
    log(err);
  });

  mongoose.connection.on('reconnect', function() {
    log('Recconecting to MongoDB on URI: %s', uri);
  });

  mongoose.connection.on('connected', function() {
    log('Connected to MongoDB on URI: %s', uri);
  });

  mongoose.connection.on('connecting', function() {
    log('Connecting to MongoDB database %s', opts.dbname);
  });

  mongoose.connection.on('disconnected', function(err) {
    log('Discnnected from MongoDB at URI: %s - Error: %s', uri, err);
  });

  mongoose.connection.on('open', function() {
    log('Connaction to MongoDB is now OPEN at URI: %s', uri);
  });

  if ('data' == dbid) {
    mongoose.connect(uri, dbOptions);
  } else if ('users' == dbid) {
    mongoose.createConnection(uri, dbOptions);
  } else {
    throw new Error('Invalid database id');
  }

  return mongoose;
}

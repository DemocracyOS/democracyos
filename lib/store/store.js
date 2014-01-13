/**
 * Module dependencies.
 */

var request = require('request');
var storage = require('./local')();

/**
 * Expose Store constructor
 */

module.exports = Store;

/**
 * Construct a Store instance
 */

function Store() {
  if (!(this instanceof Store)) {
    return new Store();
  };
}

Store.prototype.set = function(key, value, fn) {
  if (storage.supported) {
    return storage.set(key, value), fn(null, true);
  };

  return this.remoteSet(key, value, fn);
}

Store.prototype.get = function(key, fn) {
  if (storage.supported) {
    return fn(null, storage.get(key));
  };

  return this.remoteGet(key, fn);
}

Store.prototype.remoteSet = function(key, value, fn) {
  request
  .post('/session/' + key)
  .send(value)
  .end(function remoteSet(err, res) {
    if (err) return fn(err);
    if (!res.ok) return fn(res.error);
    fn(null, true);
  });
}

Store.prototype.remoteGet = function(key, fn) {
  request
  .get('/session/' + key)
  .end(function remoteGet(err, res) {
    if (err) return fn(err);
    if (!res.ok) return fn(res.error);
    fn(null, res.body);
  });
}
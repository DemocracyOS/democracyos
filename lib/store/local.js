/**
 * Module dependencies.
 */

var serialize = JSON.stringify;
var unserialize = require('unserialize');
var storage = window.localStorage;

/**
 * Expose `LocalStore` constructor
 */

module.exports = LocalStore;

/**
 * Expose if `localStorage` is supported
 */

exports.supported = !!storage;

/**
 * Create a `LocalStore` instance
 */

function LocalStore() {
  if (!(this instanceof LocalStore)) {
    return new LocalStore();
  };
}

LocalStore.prototype.supported = exports.supported;

LocalStore.prototype.get = function(key) {
  return unserialize(storage.getItem(key));
}

LocalStore.prototype.set = function(key, value) {
  var storageTest = 'foo';
  try {
    storage.setItem(storageTest, storageTest);
    storage.removeItem(storageTest);
  } catch(e) {
    return this;
  }
  return storage.setItem(key, serialize(value)), this;
}

LocalStore.prototype.clear = function() {
  return storage.clear(), this;
}

LocalStore.prototype.remove = function(key) {
  var lastValue = storage.getItem(key);
  return storage.removeItem(key), lastValue;
}

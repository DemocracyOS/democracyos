/**
 * Module dependencies.
 */

var store = require('store.js');

/**
 * Initilize
 */

var localStorage = {}

/**
 * Expose
 */

module.exports = localStorage;

/**
 * Define
 */

localStorage.supported = function() {
  return store.enabled;
}

localStorage.get = function(key) {
  return store.get(key);
}

localStorage.set = function(key, value) {
  return store.set(key, value);
}

localStorage.remove = function(key) {
  return store.remove(key);
}

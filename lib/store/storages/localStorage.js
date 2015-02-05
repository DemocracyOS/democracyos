/**
 * Module dependencies.
 */

var store = require('store.js');

/**
 * Initialize
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

localStorage.get = function(key, fn) {
  var val = store.get(key);
  if (fn) fn(null, val);
  return val;
}

localStorage.set = function(key, value, fn) {
  var val = store.set(key, value);
  if (fn) fn(null, val);
  return this;
}

localStorage.remove = function(key, fn) {
  var val = store.remove(key);
  if (fn) fn(null, val);
  return this;
}

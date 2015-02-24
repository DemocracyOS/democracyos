/**
 * Module dependencies.
 */

var _cookie = require('cookie');
var unserialize = require('unserialize');
var serialize = function(val){
  return typeof val === 'string' ? val : JSON.stringify(val);
}

/**
 * Expose
 */

var cookie = module.exports = {};

/**
 * Define
 */

cookie.supported = function() {
  return true;
}

cookie.get = function(key, fn) {
  var val = unserialize(_cookie(key));
  if (fn) fn(null, val);
  return val;
}

cookie.set = function(key, value, fn) {
  _cookie(key, serialize(value), { path: '/' });
  if (fn) fn(null, value);
  return this;
}

cookie.remove = function(key, fn) {
  var val = _cookie(key, null);
  if (fn) fn(null, val);
  return this;
}

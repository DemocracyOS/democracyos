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

cookie.get = function(key) {
  return unserialize(_cookie(key));
}

cookie.set = function(key, value) {
  return _cookie(key, serialize(value), { path: '/' });
}

cookie.remove = function(key) {
  return _cookie(key, null);;
}

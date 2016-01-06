/**
 * Get Object's path value
 *
 * @param {String} path
 * @param {Object} obj
 * @return {Mixed}
 * @api public
 */

function index(obj,i) {
  return obj[i]
}

function get(path, obj) {
  return path.split('.').reduce(index, obj);
}

/**
 * sanitizes some `key`'s name for propper
 * object definition
 *
 * @param {String} key
 * @return {String} sanitized key
 * @api public
 */

function sanitize(key) {
  var methods = /\(.*\)/g;
  var chars = /[^a-zA-Z_\.]/g;
  return key.replace(methods, '').replace(chars, '');
}

/**
 * Applies a mapping method for user's
 * considering some keys for an object item
 *
 * @param {String} keys
 * @return {Function} map function for `Array.prototype.map`
 * @api public
 */

export default function expose(keys) {
  keys = keys.split(' ');

  return function(item) {
    var ret = {};

    keys.forEach(function(key) {
      var segments = exports.sanitize(key).split('.');
      var cursor = ret;
      segments.forEach(function(s, i) {
        if (segments.length - 1 > i) cursor = cursor[s] = cursor[s] || {};
        else cursor[s] = exports.get(key, item);
      });
    });

    return ret;
  }
}

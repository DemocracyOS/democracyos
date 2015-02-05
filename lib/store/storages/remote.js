/**
 * Module dependencies.
 */

var request = require('request');

/**
 * Expose
 */

var remote = module.exports = {};

/**
 * Define
 */

remote.supported = function() {
  return true;
}

remote.get = function(key, fn) {
  var r = request
  .get('/session/' + key)
  .end(function storagesRemoteGet(err, res) {
    if (err && fn) return fn(err);
    if (!res.ok && fn) return fn(res.error);
    fn && fn(null, res.body);
  });
  return r;
}

remote.set = function(key, value, fn) {
  request
  .post('/session/' + key)
  .send(value)
  .end(function remoteSet(err, res) {
    if (err && fn) return fn(err);
    if (!res.ok && fn) return fn(res.error);
    fn && fn(null, true);
  });
  return this;
}

remote.remove = function(key, fn) {
  request
  .del('/session/' + key)
  .end(function remoteSet(err, res) {
    if (err && fn) return fn(err);
    if (!res.ok && fn) return fn(res.error);
    fn && fn(null, true);
  });
  return this;
}

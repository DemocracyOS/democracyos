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
  request
  .get('/session/' + key)
  .end(function storagesRemoteGet(err, res) {
    if (err) return fn(err);
    if (!res.ok) return fn(res.error);
    fn(null, res.body);
  });
}

remote.set = function(key, value, fn) {
  request
  .post('/session/' + key)
  .send(value)
  .end(function remoteSet(err, res) {
    if (err) return fn(err);
    if (!res.ok) return fn(res.error);
    fn(null, true);
  });
}

remote.remove = function(key, fn) {
  request
  .delete('/session/' + key)
  .end(function remoteSet(err, res) {
    if (err) return fn(err);
    if (!res.ok) return fn(res.error);
    fn(null, true);
  });
}

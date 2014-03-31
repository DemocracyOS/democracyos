/**
 * Module dependencies.
 */

var request = require('superagent');
var proto = request.Request.prototype;
var end = proto.end;
var bus = require('bus');
var log = require('debug')('democracyos:request');

/**
 * Expose request
 */

module.exports = request;

/**
 * Wrapper of `request.end`
 */

proto.end = function(fn) {
  var req = this;
  fn = fn || function() {};

  // emit request about to exec
  bus.emit('request', req);
  
  // Accept only json on requests
  req.set('Accept', 'application/json');
  req.set('X-CSRF-Token', csrfToken);

  // if `GET`, set random query parameter
  // to avoid browser caching

  if ('GET' === req.method) req.query({ random: Math.random() });
  
  // emit `request:abort` if req aborts
  req.once('abort', function() {
    bus.emit('request:abort', req);
  });

  return end.call(req, function(err, res) {
    log('end with %s %o', err, res);
    bus.emit('request:end', res, req, err);
    
    return fn(err, res);
  });
};
/**
 * Module dependencies.
 */

var request = require('request');
var render = require('render');
var Stateful = require('stateful');
var log = require('debug')('democracyos:whitelists-proto');

/**
 * Expose `Whitelists` proto constructor
 */

module.exports = Whitelists;

/**
 * Whitelists collection constructor
 */

function Whitelists() {
  if (!(this instanceof Whitelists)) {
    return new Whitelists();
  };

  // instance bindings
  this.middleware = this.middleware.bind(this);

  this.state('initializing');
  this.fetch();
}

/**
 * Mixin Whitelists prototype with Emitter
 */

Stateful(Whitelists);

/**
 * Fetch `whitelists` from source
 *
 * @param {String} src
 * @api public
 */

Whitelists.prototype.fetch = function(src) {
  log('request in process');
  src = src || '/api/whitelists/all';

  this.state('loading');

  request
  .get(src)
  .end(onresponse.bind(this));

  function onresponse(err, res) {
    if (err || !res.ok) {
      var message = 'Unable to load whitelists. Please try reloading the page. Thanks!';
      return this.error(message);
    };

    this.set(res.body);
  }
}

/**
 * Set items to `v`
 *
 * @param {Array} v
 * @return {Whitelists} Instance of `Whitelists`
 * @api public
 */

Whitelists.prototype.set = function(v) {
  this.items = v;

  this.state('loaded');
  return this;
}

/**
 * Get current `items`
 *
 * @return {Array} Current `items`
 * @api public
 */

Whitelists.prototype.get = function() {
  return this.items;
}

/**
 * Middleware for `page.js` like
 * routers
 *
 * @param {Object} ctx
 * @param {Function} next
 * @api public
 */

Whitelists.prototype.middleware = function(ctx, next) {
  this.ready(next);
}

/**
 * Handle errors
 *
 * @param {String} error
 * @return {Whitelists} Instance of `Whitelists`
 * @api public
 */

Whitelists.prototype.error = function(message) {
  // TODO: We should use `Error`s instead of
  // `Strings` to handle errors...
  // Ref: http://www.devthought.com/2011/12/22/a-string-is-not-an-error/
  this.state('error', message);
  log('error found: %s', message);

  // Unregister all `ready` listeners
  this.off('ready');
  return this;
}
/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var request = require('request');
var render = require('render');
var Stateful = require('stateful');
var log = require('debug')('democracyos:tags-proto');

/**
 * Expose `Tags` proto constructor
 */

module.exports = Tags;

/**
 * Tags collection constructor
 */

function Tags() {
  if (!(this instanceof Tags)) {
    return new Tags();
  };

  // instance bindings
  this.middleware = this.middleware.bind(this);

  this.state('initializing');
  this.fetch();
}

/**
 * Mixin Tags prototype with Emitter
 */

Stateful(Tags);

/**
 * Fetch `tags` from source
 *
 * @param {String} src
 * @api public
 */

Tags.prototype.fetch = function(src) {
  log('request in process');
  src = src || '/api/tag/all';

  this.state('loading');

  request
  .get(src)
  .end(onresponse.bind(this));

  function onresponse(err, res) {
    if (err || !res.ok) {
      var message = 'Unable to load tags. Please try reloading the page. Thanks!';
      return this.error(message);
    };

    this.set(res.body);
  }
}

/**
 * Set items to `v`
 *
 * @param {Array} v
 * @return {Tags} Instance of `Tags`
 * @api public
 */

Tags.prototype.set = function(v) {
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

Tags.prototype.get = function() {
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

Tags.prototype.middleware = function(ctx, next) {
  this.ready(next);
}

/**
 * Handle errors
 *
 * @param {String} error
 * @return {Tags} Instance of `Tags`
 * @api public
 */

Tags.prototype.error = function(message) {
  // TODO: We should use `Error`s instead of
  // `Strings` to handle errors...
  // Ref: http://www.devthought.com/2011/12/22/a-string-is-not-an-error/
  this.state('error', message);
  log('error found: %s', message);

  // Unregister all `ready` listeners
  this.off('ready');
  return this;
}
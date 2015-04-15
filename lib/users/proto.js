/**
 * Module dependencies.
 */

var request = require('request');
var Stateful = require('stateful');
var log = require('debug')('democracyos:users-proto');

/**
 * Expose `Users` proto constructor
 */

module.exports = Users;

/**
 * Users collection constructor
 */

function Users() {
  if (!(this instanceof Users)) {
    return new Users();
  };

  // instance bindings
  this.middleware = this.middleware.bind(this);
  this.fetch = this.fetch.bind(this);

  this.$_path = '/api/users/all';
  this.state('initializing');

  this.fetch();
}

/**
 * Mixin Users prototype with Stateful
 */

Stateful(Users);

/**
 * Fetch `users` from source
 *
 * @param {Integer} page
 * @api public
 */

Users.prototype.fetch = function(search, page) {
  log('request in process');

  search = search || '';
  page = page || 0;

  this.state('loading');

  request
  .get(this.$_path)
  .query({ search: search, page: page })
  .end(onresponse.bind(this));

  function onresponse(err, res) {
    if (err || !res.ok) {
      var message = 'Unable to load users. Please try reloading the page. Thanks!';
      return this.error(message);
    };

    this.set(res.body);
  }
}

/**
 * Set items to `v`
 *
 * @param {Array} v
 * @return {Users} Instance of `Users`
 * @api public
 */

Users.prototype.set = function(v) {
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

Users.prototype.get = function() {
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

Users.prototype.middleware = function(ctx, next) {
  this.ready(next);
}

/**
 * Handle errors
 *
 * @param {String} error
 * @return {Users} Instance of `Users`
 * @api public
 */

Users.prototype.error = function(message) {
  // TODO: We should use `Error`s instead of
  // `Strings` to handle errors...
  // Ref: http://www.devthought.com/2011/12/22/a-string-is-not-an-error/
  this.state('error', message);
  log('error found: %s', message);

  // Unregister all `ready` listeners
  this.off('ready');
  return this;
}
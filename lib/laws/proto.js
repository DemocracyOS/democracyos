/**
 * Module dependencies.
 */

import Emitter from '../emitter/emitter.js';
import citizen from '../citizen/citizen.js';
import request from '../request/request.js';
import render from '../render/render.js';
import Stateful from '../stateful/stateful.js';
import debug from 'debug';

let log = debug('democracyos:laws-proto');

export default class Laws extends Stateful {
  constructor () {
    super();
    // instance bindings
    this.middleware = this.middleware.bind(this);
    this.fetch = this.fetch.bind(this);

    this.state('initializing');

    // Re-fetch laws on citizen sign-in
    citizen.on('loaded', this.fetch);

    this.fetch();
  }

  /**
   * Fetch `laws` from source
   *
   * @param {String} src
   * @api public
   */

  fetch (src) {
    log('request in process');
    src = src || '/api/law/all';

    this.state('loading');

    request
    .get(src)
    .end(onresponse.bind(this));

    function onresponse(err, res) {
      if (err || !res.ok) {
        var message = 'Unable to load laws. Please try reloading the page. Thanks!';
        return this.error(message);
      };

      this.set(res.body);
    }
  }

  /**
   * Set items to `v`
   *
   * @param {Array} v
   * @return {Laws} Instance of `Laws`
   * @api public
   */

  set (v) {
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

  get () {
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

  middleware (ctx, next) {
    this.ready(next);
  }

  /**
   * Handle errors
   *
   * @param {String} error
   * @return {Laws} Instance of `Laws`
   * @api public
   */

  error (message) {
    // TODO: We should use `Error`s instead of
    // `Strings` to handle errors...
    // Ref: http://www.devthought.com/2011/12/22/a-string-is-not-an-error/
    this.state('error', message);
    log('error found: %s', message);

    // Unregister all `ready` listeners
    this.off('ready');
    return this;
  }
}

// function Laws() {
//   if (!(this instanceof Laws)) {
//     return new Laws();
//   };

//   // instance bindings
//   this.middleware = this.middleware.bind(this);
//   this.fetch = this.fetch.bind(this);

//   this.state('initializing');

//   // Re-fetch laws on citizen sign-in
//   citizen.on('loaded', this.fetch);

//   this.fetch();
// }

// /**
//  * Mixin Laws prototype with Emitter
//  */

// // Emitter(Laws.prototype);
// Stateful(Laws);

// /**
//  * Fetch `laws` from source
//  *
//  * @param {String} src
//  * @api public
//  */

// fetch (src) {
//   log('request in process');
//   src = src || '/api/law/all';

//   this.state('loading');

//   request
//   .get(src)
//   .end(onresponse.bind(this));

//   function onresponse(err, res) {
//     if (err || !res.ok) {
//       var message = 'Unable to load laws. Please try reloading the page. Thanks!';
//       return this.error(message);
//     };

//     this.set(res.body);
//   }
// }

// *
//  * Set items to `v`
//  *
//  * @param {Array} v
//  * @return {Laws} Instance of `Laws`
//  * @api public
 

// Laws.prototype.set = function(v) {
//   this.items = v;
//   this.state('loaded');
//   return this;
// }

// /**
//  * Get current `items`
//  *
//  * @return {Array} Current `items`
//  * @api public
//  */

// Laws.prototype.get = function() {
//   return this.items;
// }

// /**
//  * Middleware for `page.js` like
//  * routers
//  *
//  * @param {Object} ctx
//  * @param {Function} next
//  * @api public
//  */

// Laws.prototype.middleware = function(ctx, next) {
//   this.ready(next);
// }

// /**
//  * Handle errors
//  *
//  * @param {String} error
//  * @return {Laws} Instance of `Laws`
//  * @api public
//  */

// Laws.prototype.error = function(message) {
//   // TODO: We should use `Error`s instead of
//   // `Strings` to handle errors...
//   // Ref: http://www.devthought.com/2011/12/22/a-string-is-not-an-error/
//   this.state('error', message);
//   log('error found: %s', message);

//   // Unregister all `ready` listeners
//   this.off('ready');
//   return this;
// }
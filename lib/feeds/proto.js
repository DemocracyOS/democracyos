/**
 * Module dependencies.
 */

import Emitter from '../emitter/emitter.js';
import request from '../request/request.js';
import render from '../render/render.js';
import Stateful from '../stateful/stateful.js';
import debug from 'debug';

let log = debug('democracyos:feeds-proto');

export default class feeds extends Stateful {
  constructor () {
    super();

    // instance bindings
    this.middleware = this.middleware.bind(this);
    this.fetch = this.fetch.bind(this);

    this.state('initializing');

    this.fetch();
  }

  /**
   * Fetch `feeds` from source
   *
   * @param {String} src
   * @api public
   */

  fetch (src) {
    log('request in process');
    src = src || '/api/feeds/all';

    this.state('loading');

    request
    .get(src)
    .end(onresponse.bind(this));

    function onresponse(err, res) {
      if (err || !res.ok) {
        var message = 'Unable to load feeds. Please try reloading the page. Thanks!';
        return this.error(message);
      };

      this.set(res.body);
    }
  }

  /**
   * Set items to `v`
   *
   * @param {Array} v
   * @return {feeds} Instance of `feeds`
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
   * @return {feeds} Instance of `feeds`
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

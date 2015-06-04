/**
 * Module dependencies.
 */

import Emitter from '../emitter/emitter.js';
import user from '../user/user.js';
import request from '../request/request.js';
import render from '../render/render.js';
import Stateful from '../stateful/stateful.js';
import debug from 'debug';

let log = debug('democracyos:topics-proto');

export default class Topics extends Stateful {
  constructor () {
    super();
    // instance bindings
    this.middleware = this.middleware.bind(this);
    this.fetch = this.fetch.bind(this);

    this.state('initializing');

    // Re-fetch topics on user sign-in
    user.on('loaded', this.fetch);

    this.fetch();
  }

  /**
   * Fetch `topics` from source
   *
   * @param {String} src
   * @api public
   */

  fetch (src) {
    log('request in process');
    src = src || '/api/topic/all';

    this.state('loading');

    request
    .get(src)
    .end(onresponse.bind(this));

    function onresponse(err, res) {
      if (err || !res.ok) {
        var message = 'Unable to load topics. Please try reloading the page. Thanks!';
        return this.error(message);
      };

      this.set(res.body);
    }
  }

  /**
   * Set items to `v`
   *
   * @param {Array} v
   * @return {Topics} Instance of `Topics`
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
   * @return {Topics} Instance of `Topics`
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

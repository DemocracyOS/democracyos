/**
 * Module dependencies.
 */

import debug from 'debug'
import request from '../request/request.js'
import Stateful from '../stateful/stateful.js'

let log = debug('democracyos:whitelists-proto')

export default class Whitelists extends Stateful {
  constructor () {
    super()
    // instance bindings
    this.middleware = this.middleware.bind(this)

    this.state('initializing')
    this.fetch()
  }

  /**
   * Fetch `whitelists` from source
   *
   * @param {String} src
   * @api public
   */

  fetch (src) {
    log('request in process')
    src = src || '/api/whitelists/all'

    this.state('loading')

    request
      .get(src)
      .end(onresponse.bind(this))

    function onresponse (err, res) {
      if (err || !res.ok) {
        let message = 'Unable to load whitelists. Please try reloading the page. Thanks!'
        return this.error(message)
      }

      this.set(res.body)
    }
  }

  /**
   * Set items to `v`
   *
   * @param {Array} v
   * @return {Whitelists} Instance of `Whitelists`
   * @api public
   */

  set (v) {
    this.items = v

    this.state('loaded')
    return this
  }

  /**
   * Get current `items`
   *
   * @return {Array} Current `items`
   * @api public
   */

  get () {
    return this.items
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
    this.ready(next)
  }

  /**
   * Handle errors
   *
   * @param {String} error
   * @return {Whitelists} Instance of `Whitelists`
   * @api public
   */

  error (message) {
    // TODO: We should use `Error`s instead of
    // `Strings` to handle errors...
    // Ref: http://www.devthought.com/2011/12/22/a-string-is-not-an-error/
    this.state('error', message)
    log('error found: %s', message)

    // Unregister all `ready` listeners
    this.off('ready')
    return this
  }
}

/**
 * Module dependencies.
 */

import Emitter from 'democracyos-emitter'
import debug from 'debug'

let log = debug('democracyos:stateful')

class Stateful extends Emitter {
  /**
   * Save or retrieve current instance
   * state and emit to observers
   *
   * @param {String} state
   * @param {String} message
   * @return {Stateful|String} Instance of `Stateful` or current `state`
   * @api public
   */

  state (state, message) {
    if (arguments.length === 0) {
      return this.$_state
    }

    log('state is now %s', state)
    this.$_state = state
    this.emit(state, message)
    return this
  }

  /**
   * Emit `ready` if collection has
   * completed a cycle of request
   *
   * @param {Function} fn
   * @return {Stateful} Instance of `Stateful`
   * @api public
   */

  ready (fn) {
    var self = this

    function done () {
      if (self.state() === 'loaded') {
        return fn()
      }
    }

    if (this.state() === 'loaded') {
      setTimeout(done, 0)
    } else {
      this.once('loaded', done)
    }

    return this
  }
}

/**
 * Expose stateful
 */

export default Stateful

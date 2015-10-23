/**
 * Module dependencies.
 */

import Emitter from 'democracyos-emitter';
import debug from 'debug';

let log = debug('democracyos:stateful');

class Stateful extends Emitter {

  constructor () {
    super();
  }

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
    if (0 === arguments.length) {
      return this.$_state;
    }

    log('state is now %s', state);
    this.$_state = state;
    this.emit(state, message);
    return this;
  };

  /**
   * Emit `ready` if collection has
   * completed a cycle of request
   *
   * @param {Function} fn
   * @return {Stateful} Instance of `Stateful`
   * @api public
   */

  ready (fn) {
    var self = this;

    function done() {
      if ('loaded' === self.state()) {
        return fn();
      }
    }

    if ('loaded' === this.state()) {
      setTimeout(done, 0);
    } else {
      this.once('loaded', done);
    }

    return this;
  }
}

/**
 * Expose stateful
 */

export default Stateful;
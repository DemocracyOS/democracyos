/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var mixin = require('mixin');
var log = require('debug')('democracyos:stateful');

function Stateful(A) {
  return mixin(A.prototype, Stateful.prototype);
}

/**
 * Add Emitter capabilities
 */

Emitter(Stateful.prototype);

/**
 * Save or retrieve current instance
 * state and emit to observers
 *
 * @param {String} state
 * @param {String} message
 * @return {Stateful|String} Instance of `Stateful` or current `state`
 * @api public
 */

Stateful.prototype.state = function(state, message) {
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

Stateful.prototype.ready = function(fn) {
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

/**
 * Expose stateful
 */

module.exports = Stateful;
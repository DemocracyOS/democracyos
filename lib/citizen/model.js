/**
 * Module dependencies.
 */

var request = require('request');
var Emitter = require('emitter');

/**
 * Expose user model
 */

module.exports = Citizen;

/**
 * Citizen
 *
 * @param {String} path user's load path
 * @return {Citizen} `Citizen` instance
 * @api public
 */

function Citizen (path) {
  if (!(this instanceof Citizen)) {
    return new Citizen(path);
  };

  this.$_path = path;
  this.state('unloaded');
}

/**
 * Inherit from `Emitter`
 */

Emitter(Citizen.prototype);

/**
 * Loads user from path
 *
 * @param {String} path user's load path
 * @return {Citizen} `Citizen` instance.
 * @api public
 */

Citizen.prototype.load = function(path) {
  var self = this;
  this.$_path = path || this.$_path;
  this.state('loading');

  request
  .get('/api/citizen/'.concat(this.$_path))
  .end(function(err, res) {
    var u = res.body;

    if (err || !res.ok) {
      return _handleRequestError.bind(self)(err || res.error);
    };

    if (!(u.id || u._id)) {
      return _handleRequestError.bind(self)('Citizen not found');
    };

    for (var prop in u) {
      if (u.hasOwnProperty(prop)) {
        self[prop] = u[prop]
      }
    }
    self.state('loaded');
  });

  return this;
}

/**
 * Call `fn` once Citizen is loaded
 *
 * @param {Function} fn callback fired on loaded
 * @return {Citizen} `Citizen` instance
 * @api public
 */

Citizen.prototype.ready = function(fn) {
  var self = this;

  function done() {
    if ('loaded' === self.state()) {
      return fn();
    }
  }

  if ('loaded' === this.state()) {
    //We force 0 timeout on call stack
    setTimeout(done, 0);
  } else {
    this.once('loaded', done);
  }

  return this;
}

/**
 * Gets or sets receiver's state and emit to observers
 *
 * @param {String} state
 * @param {String} message
 * @return {Laws|String} Instance of `Citizen` or current `state`
 * @api public
 */

Citizen.prototype.state = function(state, message) {
  if (0 === arguments.length) {
    return this.$_state;
  }

  this.$_state = state;
  this.emit(state, message);
  return this;
};

/**
 * Handle error from requests
 *
 * @param {Object} err from request
 * @api private
 */

function _handleRequestError (err) {
  this.state('unloaded');
  // FIXME: change this off for handling it on subscribers
  // Shut ready's down
  this.off('ready');
  this.emit('error', err);
}
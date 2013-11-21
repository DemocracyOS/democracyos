/**
 * Module dependencies.
 */

var request = require('request')
  , Emitter = require('emitter');

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
  this.$_ready = "unloaded";
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
  var _this = this;
  this.$_path = path || this.$_path;
  this.$_ready = "loading";

  request
  .get('/api/citizen/'.concat(this.$_path))
  .end(function(err, res) {
    var u = res.body;

    if (err || !res.ok) {
      return _handleRequestError.bind(_this)(err || res.error);
    };

    if (!(u.id || u._id)) {
      return _handleRequestError.bind(_this)('Citizen not found');
    };

    for (var prop in u) {
      if (u.hasOwnProperty(prop)) {
        _this[prop] = u[prop]
      }
    }
    _this.$_ready = "loaded";
    _this.emit('ready');
  });

  return this;
}

/**
 * Call `fn` once Citizen is
 * ready from loading
 *
 * @param {Function} fn callback fired on ready
 * @return {Citizen} `Citizen` instance
 * @api public
 */

Citizen.prototype.ready = function(fn) {
  var _this = this;

  function done() {
    if ("loaded" === _this.state()) {
      return fn();
    }
  }

  if ("loaded" === this.state()) {
    setTimeout(done, 0);
  } else {
    this.once("ready", done);
  }

  return this;
}

/**
 * Get $_ready state
 *
 * @return {String}
 * @api public
 */

Citizen.prototype.state = function() {
  return this.$_ready;
}

/**
 * Handle error from requests
 *
 * @param {Object} err from request
 * @api private
 */

function _handleRequestError (err) {
  this.$_ready = "unloaded";
  // Shut ready's down
  this.off('ready');
  this.emit('error', err);
}
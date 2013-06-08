/**
 * Module dependencies.
 */

var request = require('superagent')
  , Emitter = require('emitter');

/**
 * Expose citizen
 */

module.exports = Citizen;

/**
 * Citizen
 *
 * @param {String} path citizen's load path
 * @return {Citizen} `Citizen` instance
 * @api public
 */

function Citizen (path) {
  if (!(this instanceof Citizen)) {
    return new Citizen(path);
  };

  this.$_path = path;
}

/**
 * Inherit from `Emitter`
 */

Emitter(Citizen.prototype);

/**
 * Loads citizen from path
 *
 * @param {String} path citizen's load path
 * @return {Citizen} `Citizen` instance.
 * @api public
 */

Citizen.prototype.load = function(path) {
  var _this = this;
  this.$_path = path || this.$_path;

  request
  .get('/api/citizen/'.concat(this.$_path))
  .set('Accept', 'application/json')
  .on('error', _handleRequestError)
  .end(function(res) {
    if (!res.ok) return;

    for (var prop in res.body) {
      if (res.body.hasOwnProperty(prop)) {
        _this[prop] = res.body[prop]
      }
    }

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
  this.once('ready', fn);
  return this;
}

/**
 * Handle error from requests
 *
 * @param {Object} err from request
 * @api private
 */

function _handleRequestError (err) {
  console.log(err);
}

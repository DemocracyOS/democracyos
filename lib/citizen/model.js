/**
 * Module dependencies.
 */

var request = require('request');
var Stateful = require('stateful');
var jwt = require('jwt');

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

  this.$_state = 'unloaded';
  this.$_path = path;
}

/**
 * Inherit from `Stateful`
 */

Stateful(Citizen);

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

    self.set(u);
  });

  return this;
}

/**
 * Set user attributes
 *
 * @param {Hash} User attributes.
 * @return {Citizen} `Citizen` instance.
 * @api public
 */

Citizen.prototype.set = function(attrs) {
  var self = this;

  for (var prop in attrs) {
    if (attrs.hasOwnProperty(prop)) {
      self[prop] = attrs[prop];
    }
  }

  self.state('loaded');

  return this;
}

/**
 * Returns wether the receiver is logged (i.e.: sign in)
 *
 * @return {Boolean}
 * @api public
 */

Citizen.prototype.logged = function() {
  return !!this.id;
}

/**
 * Unloads instance and notifies observers.
 *
 * @return {Citizen}
 * @api public
 */

Citizen.prototype.unload = function() {
  this.cleanup();
  this.$_path = null;
  jwt.clear();
  this.state('unloaded');
  return this;
};

/**
 * Cleans up citizen
 *
 * @api private
 */

Citizen.prototype.cleanup = function() {
  for (var i in this) {
    if ('_callbacks' == i) continue;
    if ('$' == i.charAt(0)) continue;
    if (!this.hasOwnProperty(i)) continue;
    if ('function' == typeof this[i]) continue;
    delete this[i];
  }
};

/**
 * Returns profile picture
 *
 * @api private
 */

Citizen.prototype.profilePicture = function() {
  if (this.profilePictureUrl) return this.profilePictureUrl;
  return this.gravatar;
};

/**
 * Handle error from requests
 *
 * @param {Object} err from request
 * @api private
 */

function _handleRequestError (err) {
  // FIXME: change this off for handling it on subscribers
  // Shut ready's down
  this.off('ready');
  this.emit('error', err);
}
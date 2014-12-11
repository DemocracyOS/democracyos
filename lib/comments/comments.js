
/**
 * Module dependencies.
 */

var citizen = require('citizen');
var request = require('request');
var Stateful = require('stateful');

/**
 * Expose Comments
 */

module.exports = Comments;

/**
 * Create Comments
 */

function Comments(law, path, options) {
  if (!(this instanceof Comments)) {
    return new Comments(path);
  }

  this.$_law = law;
  this.$_state = 'unloaded';
  this.$_path = path || 'comments';
  this.$_options = options;
  this.items = [];
  this.load();
}

/**
 * Inherit from `Stateful`
 */

Stateful(Comments);

/**
 * Load comments
 */

Comments.prototype.load = function() {
  var self = this;
  this.$_path = this.$_path;
  this.state('loading');

  request
  .get(this.url())
  .query({ exclude_user: this.$_options.exclude_user })
  .end(function(err, res) {
    var items = res.body;

    if (err || !res.ok) {
      return _handleRequestError.bind(self)(err || res.error);
    };

    this.items = items;
    self.state('loaded');
  });

  return this;
};

/**
 * Get api route
 */

Comments.prototype.url = function() {
  return '/api/law/:id/:path'
    .replace(':id', this.$_law.id)
    .replace(':path', this.$_path);
}

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
import request from '../request/request';
import Stateful from '../stateful/stateful';
import config from '../config/config';

export default class Citizen extends Stateful {

  /**
   * Citizen
   *
   * @param {String} path user's load path
   * @return {Citizen} `Citizen` instance
   * @api public
   */

  constructor (path) {
    super();
    this.$_state = 'unloaded';
    this.$_path = path;
  }

  /**
   * Loads user from path
   *
   * @param {String} path user's load path
   * @return {Citizen} `Citizen` instance.
   * @api public
   */

  load (path) {
    this.$_path = path || this.$_path;
    this.state('loading');

    request
    .get('/api/citizen/'.concat(this.$_path))
    .end((err, res) => {
      var u = res.body;
      if (err || !res.ok) {
        return this._handleRequestError(err || res.error);
      }

      if (!(u.id || u._id)) {
        return this._handleRequestError('Citizen not found');
      }

      this.set(u);
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

  set (attrs) {
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

  logged () {
    return !!this.id;
  }

  /**
   * Unloads instance and notifies observers.
   *
   * @return {Citizen}
   * @api public
   */

  unload (cb) {
    var self = this;
    this.cleanup();
    this.$_path = null;

    request
    .del('/signin')
    .send()
    .end((err, res) => {
      if (!err) self.state('unloaded');
      'function' === typeof cb && cb(err);
    });
  }

  /**
   * Cleans up citizen
   *
   * @api private
   */

  cleanup () {
    for (let i in this) {
      if ('_callbacks' == i) continue;
      if ('_events' == i) continue;
      if ('$' == i.charAt(0)) continue;
      if (!this.hasOwnProperty(i)) continue;
      if ('function' == typeof this[i]) continue;
      delete this[i];
    }
  }

  /**
   * Returns profile picture
   *
   * @api private
   */

  profilePicture () {
    return this.avatar;
  }

  /**
   * Handle error from requests
   *
   * @param {Object} err from request
   * @api private
   */

  _handleRequestError (err) {
    // FIXME: change this off for handling it on subscribers
    // Shut ready's down
    this.off('ready');
    this.emit('error', err);
  }
}
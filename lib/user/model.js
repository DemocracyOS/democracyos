import bus from 'bus';
import request from '../request/request';
import Stateful from '../stateful/stateful';
import config from '../config/config';

export default class User extends Stateful {

  /**
   * User
   *
   * @param {String} path user's load path
   * @return {User} `User` instance
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
   * @return {User} `User` instance.
   * @api public
   */

  load (path) {
    if (this.$_path === path && 'loading' === this.state()) return this;

    this.$_path = path || this.$_path;
    this.state('loading');

    request
    .get('/api/user/'.concat(this.$_path))
    .end((err, res) => {
      var u = res.body;
      if (err || !res.ok) {
        this.state('unloaded');
        return this._handleRequestError(err || res.error);
      }

      if (!(u.id || u._id)) {
        this.state('unloaded');
        return this._handleRequestError('User not found');
      }

      if ('me' === path) bus.emit('login');

      this.set(u);
    });

    return this;
  }

  /**
   * Set user attributes
   *
   * @param {Hash} User attributes.
   * @return {User} `User` instance.
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
   * @return {User}
   * @api public
   */

  unload () {
    var self = this;
    this.cleanup();
    this.$_path = null;

    request
    .del('/signin')
    .send()
    .end();

    this.state('unloaded');
    return this;
  }

  /**
   * Test if user is admin of a given forum
   *
   * @api public
   */

  isOwner (forum) {
    if (config.multiForum) {
      return forum.owner.id === this.id;
    } else {
      return this.staff;
    }
  }

  /**
   * Cleans up user
   *
   * @api private
   */

  cleanup () {
    for (let i in this) {
      if ('_eventCollection' == i) continue;
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
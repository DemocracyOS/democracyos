import request from '../request/request';
import Emitter from '../emitter/emitter';

export default class Forum extends Emitter {

  /**
   * Forum
   *
   * @param {String} name forum's load name
   * @return {Forum} `Forum` instance
   * @api public
   */

  constructor (name) {
    super();
    this.$_state = 'unloaded';
    this.$_name = name;
  }

  /**
   * Loads forum from path
   *
   * @param {String} path forum's load path
   * @return {Forum} `Forum` instance.
   * @api public
   */

  load () {
    this.state('loading');

    request
    .get('/api/forum/'.concat(this.$_name))
    .end((err, res) => {
      var u = res.body;
      if (err || !res.ok) {
        return this._handleRequestError(err || res.error);
      }

      if (!u.id && !u._id) {
        return this._handleRequestError('Forum not found');
      }

      this.set(u);
    });

    return this;
  }

  /**
   * Set forum attributes
   *
   * @param {Hash} Forum attributes.
   * @return {Forum} `Forum` instance.
   * @api public
   */

  set (attrs) {
    for (var prop in attrs) {
      if (attrs.hasOwnProperty(prop)) {
        this[prop] = attrs[prop];
      }
    }

    this.state('loaded');

    return this;
  }

  /**
   * Unloads instance and notifies observers.
   *
   * @return {Forum}
   * @api public
   */

  unload () {
    this.state('unloaded');
    return this;
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

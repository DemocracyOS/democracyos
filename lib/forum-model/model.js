import request from '../request/request';

export default class Forum {

  /**
   * Forum
   *
   * @param {String} name forum's load name
   * @return {Forum} `Forum` instance
   * @api public
   */

  constructor (name) {
    this.$_name = name;
  }

  /**
   * Forcefully fetch data from the server
   *
   * @return {Promise}
   * @api public
   */

   fetch () {
    if (this.$_fetch) return this.$_fetch;

    this.$_fetch = new Promise((resolve, reject) => {
      request
        .get('/api/forum/' + this.$_name)
        .end((err, res) => {
          this.$_fetch = null;

          if (err || !res.ok) return reject(err || res.error);

          var u = res.body;

          if (!u || !u.id) return reject(new Error('Not found'));

          this.set(u);

          resolve(this);
        });
    });

    this.$_lastFetch = this.$_fetch;
    return this.$_fetch;
  }

  /**
   * Loads forum from server only once until unload() is called.
   *
   * @return {Promise} `Promise` instance.
   * @api public
   */

  load () {
    if (this.$_lastFetch) return this.$_lastFetch;
    return this.fetch();
  }


  /**
   * Unloads forum to let again be load()
   *
   * @return {Promise} `Promise` instance.
   * @api public
   */

  unload () {
    this.$_lastFetch = null;
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

    return this;
  }

  /**
   * Cleans up user
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

}

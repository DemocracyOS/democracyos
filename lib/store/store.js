import bus from 'bus';
import request from '../request/request';

export default class Store {

  constructor () {
    this._fetches = {};
    this._requests = {};
    this._destroys = {};
    this.items = {};
  }

  /**
   * Name of the scope, to be used as a namespace for events, logs, etc.
   *
   * @return {String} name
   * @api public
   */
  name () {
    throw new Error('Store must implement name():string');
  }

  /**
   * Returns url where to fetch models, must implement GET, POST, DELETE.
   *
   * @param {String} id
   * @return {String} url
   * @api public
   */
  url (/* id, ...options */) {
    throw new Error('Store must implement url(id):string');
  }

  /**
   * Method to implement the parsing of the returned Model on .get().
   * Could be used to add template properties/methods on the received object.
   *
   * @param {Object} item
   * @return {Object} item
   * @api protected
   */
  parse (item) {
    return item;
  }

  /**
   * Cleans the cache of a previously getted model. Once unloaded will be
   * fetched to the server again when .get() is called.
   *
   * @param {String} id
   * @api public
   */
  unload (id) {
    if (!this.items[id]) return this;

    if (this._fetches[id]) this._requests[id].abort();

    delete this.items[id];

    bus.emit(`${this.name()}:unload:${id}`);

    return this;
  }

  /**
   * Method to get a Model from the Database.
   *
   * @param {String} id
   * @return {Promise} fetch
   * @api public
   */
  get (id, ...options) {
    if (this.items[id]) return Promise.resolve(this.items[id]);
    if (this._fetches[id]) return this._fetches[id];

    this._fetches[id] = new Promise((resolve, reject) => {
      this._requests[id] = request
        .get(this.url(id, ...options))
        .end((err, res) => {
          delete this._requests[id];
          delete this._fetches[id];

          if (err || !res.ok) return reject(err || res.error);

          var u = res.body;

          this.items[id] = this.parse(u);

          resolve(u);

          bus.emit(`${this.name()}:update:${id}`, u);
        });
    });

    return this._fetches[id];
  }

  /**
   * Sends to the server a DELETE call to .url(id), and unloads
   *
   * @param {String} id
   * @return {Promise} fetch
   * @api public
   */
  destroy (id, ...options) {
    if (!this.items[id]) {
      return Promise.reject(new Error('Cannot delete unexistent item.'));
    }

    if (this._destroys[id]) return this._destroys[id];

    this._destroys[id] = new Promise((resolve, reject) => {
      request
        .del(this.url(id, ...options))
        .end((err, res) => {
          delete this._destroys[id];

          if (err || !res.ok) return reject(err || res.error);

          this.unload(id);

          resolve();

          bus.emit(`${this.name()}:destroy:${id}`);
        });
    });

    return this._destroys[id];
  }
}

import bus from 'bus';
import debug from 'debug';
import MemoryCache from './memory-cache';
import request from '../request/request';

export default class Store {

  constructor () {
    this._fetches = new MemoryCache();
    this._fetchRequests = new MemoryCache();
    this._destroys = new MemoryCache();
    this.items = new MemoryCache();
    this.allItems = null;

    this.log = debug(`democracyos:${this.name()}-store`);
  }

  busEmit (scope, ...args) {
    bus.emit(`${this.name()}-store:${scope}`, ...args);
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
  url (id) {
    return `/api/${this.name()}/${id}`;
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
    if (this.items.remove(id)) {
      this._fetchAbort(id);
      this.busEmit(`unload:${id}`);
    }
    return this;
  }

  /**
   * Method to get a Model from the Database.
   *
   * @param {String} id
   * @return {Promise} fetch
   * @api public
   */
  findOne (id, ...args) {
    if (this.items.get(id)) return Promise.resolve(this.items.get(id));
    if (this._fetches.get(id)) return this._fetches.get(id);

    let fetch = this._fetch(id, ...args);

    fetch
      .then(item => {
        this.items.set(id, item);
        this.busEmit(`update:${id}`, item);
        return item;
      })
      .catch(err => {
        this.log('Found error', err);
        throw err;
      });

    return fetch;
  }

  /**
   * Method to get a Model from the Database.
   *
   * @param {String} id
   * @return {Promise} fetch
   * @api public
   */
  findAll (...args) {
    if (this.allItems) return Promise.resolve(this.allItems);
    if (this._fetches.get('all')) return this._fetches.get('all');

    let fetch = this._fetch('all', ...args);

    fetch
      .then(items => {
        this.allItems = items;
        this.busEmit(`all:load`, items);
      })
      .catch(err => {
        this.log('Found error', err);
      });

    return fetch;
  }

  /**
   * Sends to the server a DELETE call to .url(id), and unloads
   *
   * @param {String} id
   * @return {Promise} fetch
   * @api public
   */
  destroy (id) {
    let item = this.items.get(id);
    if (!item) {
      return Promise.reject(new Error('Cannot delete unexistent item.'));
    }

    if (this._destroys.get(id)) return this._destroys.get(id);

    let destroy = new Promise((resolve, reject) => {
      request
        .del(this.url(id))
        .end((err, res) => {
          this._destroys.remove(id);

          if (err || !res.ok) return reject(err);

          this.unload(id);

          resolve(item);

          this.busEmit(`destroy:${id}`, item);
        });
    });

    this._destroys.set(id, destroy);

    return destroy;
  }

  /**
   * Fetch an item from backend
   *
   * @param {String} id
   * @return {Promise} fetch
   * @api protected
   */
  _fetch (id, ...args) {
    if (this._fetches.get(id)) return this._fetches.get(id);

    let fetch = new Promise((resolve, reject) => {
      let req = request
        .get(this.url(id, ...args))
        .end((err, res) => {
          this._fetches.remove(id);
          this._fetchRequests.remove(id);

          if (err) return reject(err);

          let item;
          if (res.body instanceof Array) {
            item = res.body.map(this.parse);
          } else {
            item = this.parse(res.body);
          }

          resolve(item);
        });

      this._fetchRequests.set(id, req);
    });

    this._fetches.set(id, fetch);

    return fetch;
  }

  /**
   * Aborts a currently running fetch to the server
   *
   * @param {String} id
   * @api protected
   */
  _fetchAbort (id) {
    if (!this._fetchRequests.get(id)) return;
    this._fetchRequests.get(id).abort();
  }
}

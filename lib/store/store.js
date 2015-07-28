import bus from 'bus';
import debug from 'debug';
import encode from 'mout/queryString/encode';
import findIndex from 'mout/array/findIndex';
import MemoryCache from './memory-cache';
import request from '../request/request';

export default class Store {
  constructor () {
    const self = this;

    this._fetches = new MemoryCache;
    this._fetchRequests = new MemoryCache;
    this._destroys = new MemoryCache;
    this.item = new MemoryCache;

    this._findAllCache = {
      url: null,
      items: []
    };

    // Update the cache of findAll method
    let oldItemSet = this.item.set.bind(this.item);
    this.item.set = function(id, item) {
      oldItemSet(id, item);
      self._findAllCacheUpdate(item);
    };

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
  url (id, params = {}) {
    return `/api/${this.name()}/${id}${encode(params)}`;
  }

  /**
   * Method to implement the parsing of the returned Model on ._fetch().
   * Could be used to add template properties/methods on the received object.
   *
   * @param {Object} item
   * @return {Promise} item
   * @api protected
   */
  parse (item) {
    return Promise.resolve(item);
  }

  /**
   * Cleans the cache of a previously getted model. Once unloaded will be
   * fetched to the server again when .get() is called.
   *
   * @param {String} id
   * @api public
   */
  unload (id) {
    if (this.item.remove(id)) {
      this._fetchAbort(this.url(id));
      this.busEmit(`unload:${id}`);
    }
  }

  /**
   * Method to get a Model from the Database.
   *
   * @param {String} id
   * @return {Promise} fetch
   * @api public
   */
  findOne (id) {
    if (this.item.get(id)) return Promise.resolve(this.item.get(id));

    let url = this.url(id);

    if (this._fetches.get(url)) return this._fetches.get(url);

    let fetch = this._fetch(url);

    fetch.then(item => {
      this.item.set(id, item);
      this.busEmit(`update:${id}`, item);
    }).catch(err => {
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
    let item = this.item.get(id);
    if (!item) {
      return Promise.reject(new Error('Cannot destroy not fetched item.'));
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
  _fetch (url) {
    if (this._fetches.get(url)) return this._fetches.get(url);

    let fetch = new Promise((resolve, reject) => {
      let req = request
        .get(url)
        .end((err, res) => {
          this._fetches.remove(url);
          this._fetchRequests.remove(url);
          if (err) return reject(err);

          if (Array.isArray(res.body)) {
            Promise.all(res.body.map(this.parse)).then(resolve);
          } else {
            this.parse(res.body).then(resolve);
          }
        });

      this._fetchRequests.set(url, req);
    });

    this._fetches.set(url, fetch);

    return fetch;
  }

  /**
   * Aborts a currently running fetch to the server
   *
   * @param {String} id
   * @api protected
   */
  _fetchAbort (url) {
    let req = this._fetchRequests.get(url);
    if (req) req.abort();
  }

  /**
   * Method to find a list of Models from the Database and cache them.
   *
   * @param {String} id
   * @return {Promise} fetch
   * @api public
   */
  findAll (...args) {
    let url = this.url('all', ...args);

    if (this._findAllCache.url === url) {
      return Promise.resolve(this._findAllCache.items);
    }

    if (this._fetches.get(url)) return this._fetches.get(url);

    let fetch = this._fetch(url);

    fetch.then(items => {
      this._findAllCache = {
        url: url,
        items: items
      };
      this.busEmit('update:all', items);
    }).catch(err => {
      this.log('Found error', err);
    });

    return fetch;
  }

  _findAllCacheUpdate (item) {
    let cachedItemIndex = findIndex(this._findAllCache.items, i => item.id == i.id);
    if (cachedItemIndex) {
      this._findAllCache.items[cachedItemIndex] = item;
      this.busEmit('update:all', this._findAllCache.items);
    }
  }
}

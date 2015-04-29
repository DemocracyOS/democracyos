import local from './storages/localStorage.js';
import cookie from './storages/cookie.js';

/**
 * Load Storage Options
 */

let _storages = {}

function getStorage(name) {
  if (!_storages[name]) {
    if ('localStorage' === name) {
      _storages[name] = local;
    } else if ('cookie' === name) {
      _storages[name] = cookie;
    } else {
      throw new Error('Storage not supported: ' + name);
    }
  }

  return _storages[name];
}

/**
 * Default Options
 */

let defaults = {
  /**
   * Storage methods to use, fallbacks in order.
   * Available: ['localStorage', 'cookie']
   */
  use: ['localStorage', 'cookie']
}

/**
 * Construct a Store instance
 */

export default class Store {
  constructor (options) {
    options = options || defaults;

    for (var i = 0; i < options.use.length; i++) {
      var storage = getStorage(options.use[i]);
      if (storage.supported()) {
        this.storage = storage;
        break;
      }
    }
  }

  get () {
    return this.storage.get.apply(this, arguments);
  }

  set () {
    return this.storage.set.apply(this, arguments);
  }

  remove () {
    return this.storage.remove.apply(this, arguments);
  }
}

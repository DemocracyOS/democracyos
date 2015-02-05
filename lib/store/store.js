/**
 * Expose Store constructor
 */

module.exports = Store;

/**
 * Load Storage Options
 */

var _storages = {}

function getStorage(name) {
  if (!_storages[name]) {
    if( name === 'localStorage' ) {
      _storages[name] = require('./storages/localStorage.js');
    } else if( name === 'cookie' ) {
      _storages[name] = require('./storages/cookie.js');
    } else {
      _storages[name] = require('./storages/remote.js');
    }
  }

  return _storages[name];
}

/**
 * Default Options
 */

var defaults = {
  /**
   * Storage methods to use, fallbacks in order.
   * Available: ['localStorage', 'cookie', 'remote']
   */
  use: ['localStorage', 'remote']
}

/**
 * Construct a Store instance
 */

function Store(options) {
  if (!(this instanceof Store)) {
    return new Store(options);
  };

  options = options || defaults;

  for (var i = 0; i < options.use.length; i++) {
    var storage = getStorage(options.use[i]);
    if (storage.supported()) {
      this.storage = storage;
      break;
    }
  }
}

Store.prototype.get = function() {
  return this.storage.get.apply(this, arguments);
}

Store.prototype.set = function() {
  return this.storage.set.apply(this, arguments);
}

Store.prototype.remove = function() {
  return this.storage.remove.apply(this, arguments);
}

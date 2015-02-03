/**
 * Load Storage Options
 */

var storages = {
  localStorage: require('./storages/localStorage'),
  cookie: require('./storages/cookie'),
  remote: require('./storages/remote')
}

/**
 * Expose Store constructor
 */

module.exports = Store;

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

  this.storage = options.find(function(val){
    return storages[val].supported();
  })
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
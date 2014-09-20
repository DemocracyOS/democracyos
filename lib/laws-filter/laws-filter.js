/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var store = require('store')();
var laws = require('laws');
var citizen = require('citizen');
var merge = require('merge-util');
var t = require('t');
var type = require('type');
var _ = require('to-function');
var sorts = require('./sorts');
var Stateful = require('stateful');
var log = require('debug')('democracyos:laws-filter');

/**
 * Create a `LawsFilter` instance
 */

function LawsFilter() {
  if (!(this instanceof LawsFilter)) {
    return new LawsFilter();
  };

  this.reset = this.reset.bind(this);
  this.fetch = this.fetch.bind(this);
  this.refresh = this.refresh.bind(this);
  this.onlawsload = this.onlawsload.bind(this);

  this.state('initializing');
  this.initialize();

  laws.on('loaded', this.onlawsload);

  //TODO: make all this dependent on `bus` when making views reactive in #284
  citizen.on('loaded', this.refresh);
  citizen.on('unloaded', this.reset);
}

/**
 * Mixin `LawsFilter` with `Stateful`
 */

Stateful(LawsFilter);

/**
 * Initialize `$_filters`, `$_items`, `$_counts`, and `sorts`
 *
 * @api private
 */

LawsFilter.prototype.initialize = function() {
  this.$_items = [];
  this.$_counts = [];

  // TODO: remove this hardcode and use a default sort (maybe by config?)
  this.$_filters = {};
  this.$_filters['sort'] = 'closing-soon';
  this.$_filters['status'] = 'open';

  this.sorts = sorts;
}

/**
 * Re-fetch after `laws.ready` state
 *
 * @api private
 */

LawsFilter.prototype.refresh = function() {
  laws.ready(this.fetch);
}

/**
 * Reset filter with defaults
 *
 * @api private
 */

LawsFilter.prototype.reset = function() {
  this.initialize();
  this.set( { sort: 'closing-soon', status: 'open', 'hide-voted': false } );
}

/**
 * Re-fetch on `laws.ready`
 */

LawsFilter.prototype.onlawsload = function() {
  laws.ready(this.fetch);
};

/**
 * When a law gets voted
 */

LawsFilter.prototype.vote = function(id) {
  this.items().forEach(function (item) {
    if (item.id == id) {
      item.voted = true;
    }
  });
};

/**
 * Fetch for filters
 */

LawsFilter.prototype.fetch = function() {
  if (!citizen.logged()){
    this.reset();
    this.state('loaded');
  } else {
    store.get('laws-filter', ondata.bind(this));
  }

  function ondata (err, data) {
    if (err) log('unable to fetch');
    this.set(data);
    this.state('loaded');
  }
}


LawsFilter.prototype.items = function(v) {
  if (0 === arguments.length) {
    return this.$_items;
  }

  this.$_items = v;
}

/**
 * Get all current `$_filters` or just the
 * one provided by `key` param
 *
 * @param {String} key
 * @return {Array|String} all `$_filters` or just the one by `key`
 * @api public
 */

LawsFilter.prototype.get = function(key) {
  if (0 === arguments.length) {
    return this.$_filters;
  };

  return this.$_filters[key];
}

/**
 * Set `$_filters` to whatever provided
 *
 * @param {String|Object} key to set `value` or `Object` of `key-value` pairs
 * @param {String} value
 * @return {LawsFilter} Instance of `LawsFilter`
 * @api public
 */

LawsFilter.prototype.set = function (key, value) {
  if (2 === arguments.length) {
    // Create param object and call recursively
    var obj = {};
    return obj[key] = value, this.set(obj);
  };

  // key is an object
  merge(this.$_filters, key);

  // notify change of filters
  this.ready(onready.bind(this));

  function onready() {
    this.emit('change', this.get());
  };

  // reload items with updated filters
  this.reload();

  // save current state
  return this.save();
}

/**
 * Save current filter `$_filters` to
 * `Store` if possible.
 *
 * @return {LawsFilter} Instance of `LawsFilter`
 * @api public
 */

LawsFilter.prototype.save = function () {
  if (citizen.logged()) {
    store.set('laws-filter', this.get(), onsave.bind(this));
  }

  function onsave(err, ok) {
    if (err) return log('unable to save');
    log('saved');
  }

  return this;
}

/**
 * Reload items with current `$_filters`
 * and emit `reload` after filtering/sorting
 *
 * @return {LawsFilter} Instance of `LawsFilter`
 * @api public
 */

LawsFilter.prototype.reload = function() {
  log('reload items');

  var items = laws.get();
  var status = this.get('status');
  var sortType = this.get('sort');
  var sortFn = sorts[sortType].sort;
  var hideVoted = this.get('hide-voted');

  this.$_counts['open'] = items.filter(function (i) { return i.publishedAt && i.status == 'open' }).length;
  this.$_counts['closed'] = items.filter(function (i) { return i.publishedAt && i.status == 'closed' }).length;

  // TODO: remove this once #288 is closed
  // Always exclude drafts
  items = items.filter(_('publishedAt != null'))

  // Filter by status
  items = items.filter(_({ status: status }));

  // Check if logged user's id is in the law's participants
  if (hideVoted) {
    items = items.filter(function(item) {
      return true !== item.voted;
    });
  }

  // Sort filtered
  items = items.sort(sortFn);

  // save items
  this.items(items);

  this.ready(onready.bind(this));

  function onready() {
    this.emit('reload', this.items());
  };

  return this;
}

/**
 * Counts laws under a specific
 * status, without side-effect
 * 
 * @param {String} status filter criteria
 * @return {Number} Count of laws with `status` status
 */

LawsFilter.prototype.countFiltered = function(status) {
  // (?) Maybe this should be done on demand, and
  // provide the with the actual open laws count
  // post filters applied
  // 
  // Example:
  // 
  //    return (this.items() || [])
  //      .filter(_({ status: status }))
  //      .length;

  return this.$_counts[status];
};

/**
 * Expose a `LawsFilter` instance
 */

module.exports = new LawsFilter();

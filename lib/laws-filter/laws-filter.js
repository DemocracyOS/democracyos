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
  this.onlawsready = this.onlawsready.bind(this);

  this.state('initializing');
  this.initialize();

  laws.on('loaded', this.onlawsready)

  //TODO: make all this dependent on `bus` when making views reactive in #284
  citizen.on('loaded', this.refresh);
  citizen.on('unloaded', this.reset);
}

/**
 * Mixin `LawsFilter` with `Emitter`
 */

Emitter(LawsFilter.prototype);

LawsFilter.prototype.initialize = function() {
  this.$_items = [];
  this.$_filters = {};
  this.$_counts = [];
  this.sorts = sorts;
  // TODO: remove this hardcode and use a default sort (maybe by config?)
  this.$_filters['sort'] = 'closing-soon';
  this.$_filters['status'] = 'open';
  this.sort = sorts[this.get('sort')];
};

LawsFilter.prototype.refresh = function() {
  laws.ready(this.fetch);
}

LawsFilter.prototype.reset = function() {
  this.initialize();
  this.set( { sort: 'closing-soon', status: 'open', 'hide-voted': false } );
};

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

LawsFilter.prototype.onlawsready = function() {
  laws.ready(this.fetch);
};

LawsFilter.prototype.items = function(v) {
  if (0 === arguments.length) {
    return this.$_items;
  }

  this.$_items = v;
}

LawsFilter.prototype.get = function(key) {
  if (0 === arguments.length) {
    return this.$_filters;
  };

  return this.$_filters[key];
}

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
 * Emit `ready` if collection has
 * completed a cycle of request
 *
 * @param {Function} fn
 * @return {Laws} Instance of `Laws`
 * @api public
 */

LawsFilter.prototype.ready = function(fn) {
  var self = this;

  if ('loaded' === this.state()) {
    //We force 0 timeout on call stack
    setTimeout(done, 0);
  } else {
    this.once('loaded', done);
  }

  function done() {
    if ('loaded' === self.state()) {
      return fn();
    }
  }

  return this;
}

/**
 * Gets or sets receiver's state and emit to observers
 *
 * @param {String} state
 * @param {String} message
 * @return {Laws|String} Instance of `Laws` or current `state`
 * @api public
 */

LawsFilter.prototype.state = function(state, message) {
  if (0 === arguments.length) {
    return this.$_state;
  }

  this.$_state = state;
  this.emit(state, message);
  return this;
};

LawsFilter.prototype.reload = function() {
  var status = this.get('status');
  var hideVoted = this.get('hide-voted');
  var sortName = this.get('sort');
  var items = laws.get();

  this.$_counts['open'] = items.filter(_({ status: 'open'})).length;
  this.$_counts['closed'] = items.filter(_({ status: 'closed'})).length;

  // TODO: remove this once #288 is closed
  // Always exclude drafts
  items = items.filter(_('publishedAt != null'))

  // Filter by status
  items = status ? items.filter(_({ status: status })) : items.filter(_({ status: 'open'}));

  // Check if logged user's id is in the law's participants
  if (hideVoted) {
    items = items.filter(function(item) {
      return true !== item.voted;
    });
  }

  // Sort filtered
  // TODO: remove hardcode and make it some sort of default
  var sortFn = sortName ? sorts[sortName].sort : sorts['closing-soon'].sort;

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
 * Counts laws under a specific status, without side-effect
 * @param  {String} status filter criterion
 * @return {int}        Number of laws with parameter status
 */
LawsFilter.prototype.countFiltered = function(status) {
  return this.$_counts[status];
};

/**
 * Expose `LawsFilter` constructor
 */

module.exports = new LawsFilter();

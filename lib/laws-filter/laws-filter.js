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

  this.state('initializing');
  this.$_items = [];
  this.$_filters = {};
  this.sorts = sorts;
  this.$_filters['sort'] = 'closing-soon';
  this.sort = sorts[this.get('sort')];
  laws.ready(this.fetch.bind(this));
}

/**
 * Mixin `LawsFilter` with `Emitter`
 */

Emitter(LawsFilter.prototype);

LawsFilter.prototype.fetch = function() {

  store.get('laws-filter', ondata.bind(this));

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
  store.set('laws-filter', this.get(), onsave.bind(this));

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

  function done() {
    if ('loaded' === self.state()) {
      return fn();
    }
  }

  if ('loaded' === this.state()) {
    //We force 0 timeout on call stack
    setTimeout(done, 0);
  } else {
    this.once('loaded', done);
  }

  return this;
}

/**
 * Save or retrieve current instance
 * state and emit to observers
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

  log('state is now %s', state);
  this.$_state = state;
  this.emit(state, message);
  return this;
};

LawsFilter.prototype.reload = function() {
  var status = this.get('status');
  var hideVoted = this.get('hide-voted');
  var sortName = this.get('sort');
  var items = laws.get();
    
  // Filter by status
  if (status) {
    items = items.filter(_({ status: status }));
  };

  // Check if logged user's id is in the law's participants
  if (hideVoted) {
    items = items.filter(_('voted !== true'));
  }

  // Sort filtered
  // TODO: remove hardcode and make it some sort of default
  var sortFn = sortName ? sorts[sortName].sort : sorts['closing-soon'].sort;

  items = items.sort(sortFn);
  
  console.log('returning %s processed items', items.length);

  // save items
  this.items(items);

  this.ready(onready.bind(this));

  function onready() {
    this.emit('reload', this.items());
  };

  return this;
}

/**
 * Expose `LawsFilter` constructor
 */

module.exports = new LawsFilter();

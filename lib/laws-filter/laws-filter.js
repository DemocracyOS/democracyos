/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var store = require('store');
var laws = require('laws');
var merge = require('merge-util');
var type = require('type');
var _ = require('to-function');
var log = require('debug')('democracyos:laws-filter');

/**
 * Expose `LawsFilter` constructor
 */

module.exports = LawsFilter;

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
  this.fetch();
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
  this.emit('reload', this.items());
}

LawsFilter.prototype.get = function(key) {
  if (0 === arguments.length) {
    return this.$_filters;
  };

  return this.$_filters[key];
}

LawsFilter.prototype.set = function(key, value) {
  if (2 === arguments.length) {
    var obj = {};
    return obj[key] = value, this._set(obj);
  };

  // key is an object
  merge(this.$_filters, obj);

  // notify change of filters
  this.emit('change', this.get());

  // reload items with updated filters
  this.reload();

  // save current state
  return this.save();
}

LawsFilter.prototype.save = function() {
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
  var laws = this;

  function done() {
    if ('loaded' === laws.state()) {
      return fn();
    }
  }

  if ('loaded' === this.state()) {
    setTimeout(done, 0);
  } else {
    this.once("loaded", done);
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
  var filter = this.get();
  var items = laws.get();

  if (filter.status) {
    items = items.filter(_({ status: filter.status }));
  };

  // filter voted
  // sort by
  // 
  // items = items.sort(sorts[filter.sort].sort);
  
  // save items
  this.items(items);
  return this;
}

// var sorts = {
//   'by-date': {
//     labe: "By date",
//     sort: function (a, b) {

//   }
// }
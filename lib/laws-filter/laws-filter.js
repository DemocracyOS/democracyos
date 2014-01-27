/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var store = require('store')();
var laws = require('laws');
var merge = require('merge-util');
var t = require('t');
var type = require('type');
var _ = require('to-function');
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

LawsFilter.prototype.set = function(key, value) {
  if (2 === arguments.length) {
    // Create param object and call recursively
    var obj = {};
    return obj[key] = value, this.set(obj);
  };

  // key is an object
  merge(this.$_filters, key);

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
  var filter = this.get();
  var items = laws.get();

  // Old filters
  // if (filter.status) {
    // items = items.filter(_({ status: filter.status }));
  // };

  // filter voted
  // sort filtered laws
  // TODO remove hardcode and make it some sort of default
  var sortFn = filter.sort ? sorts[filter.sort].sort : sorts['closing-soon'].sort;

  items = items.sort(sortFn);
  
  // save items
  this.items(items);

  this.emit('reload', this.items());
  return this;
}

var sorts = {
  'closing-soon': {
    label: t('Closing soon'),
    sort: function (a, b) {
      if (Date !== typeof a.closingAt) {
        if (Date !== typeof b.closingAt) {
          // If closingAt isn't defined in both, they're equal
          return 0;
        }
        // undefined closingAt always goes last
        // b goes first in this case
        return 1;
      }

      // Closest dates first
      return a.closingAt - b.closingAt;
    }
  }
}

/**
 * Expose `LawsFilter` constructor
 */

module.exports = new LawsFilter();
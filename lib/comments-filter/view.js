/**
 * Module dependencies.
 */

var bus = require('bus');
var citizen = require('citizen');
var closest = require('closest');
var sorts = require('./sorts');
var store = require('store')();
var t = require('t');
var template = require('./template');
var View = require('view');
var log = require('debug')('democracyos:comments-filter');

module.exports = CommentsFilter;

/**
 * Create a `CommentsFilter` instance
 */

function CommentsFilter() {
  if (!(this instanceof CommentsFilter)) {
    return new CommentsFilter();
  };

  this.refresh();
  View.call(this, template, { label: this.get().label, sorts: sorts });
}

/**
 * Extend from `View`
 */

View(CommentsFilter);

/**
 * Switch on events
 *
 * @api public
 */

CommentsFilter.prototype.switchOn = function() {
  bus.on('page:change', this.bound('switchOff'));
  this.bind('click', '.dropdown li a', 'onsortclick');
  this.on('change', this.bound('onsortchange'));
  citizen.on('load', this.bound('refresh'));
}


CommentsFilter.prototype.switchOff = function() {
  bus.off('page:change', this.bound('switchOff'));
  citizen.off('loaded', this.bound('refresh'));
}

/**
 * Click on a comments sort
 *
 * @api public
 */

CommentsFilter.prototype.onsortclick = function(ev) {
  ev.preventDefault();

  var target = ev.delegateTarget || closest(ev.target, 'a');
  var li = closest(target, 'li');
  var sort = li.getAttribute('data-sort');
  this.set(sort);
}

/**
 * Change sorting criteria
 *
 * @api public
 */

CommentsFilter.prototype.onsortchange = function() {
  var btn = this.find('.btn strong');
  var sort = this.get();
  btn.html(t(sort.label));
}

/**
 * Reset sorting criteria
 *
 * @api public
 */

CommentsFilter.prototype.reset = function() {
  this.set(sorts.score);
}

/**
 * Refresh sorting criteria
 *
 * @api public
 */

CommentsFilter.prototype.refresh = function(sort) {
  if (!citizen.logged()){
    this.reset();
  } else {
    store.get('comments-filter', ondata.bind(this));
  }

  function ondata (err, data) {
    if (err) log('unable to fetch');

    if (data) {
      this.set(data);
    } else {
      this.set(sorts.score);
    }
  }
}

/**
 * Get all current `$_filter` or just the
 * one provided by `key` param
 *
 * @param {String} key
 * @return {Array|String} all `$_filter` or just the one by `key`
 * @api public
 */

CommentsFilter.prototype.get = function() {
  return this.$_filter;
}

/**
 * Set `$_filter` to whatever provided
 *
 * @param {String|Object} key to set `value` or `Object` of `key-value` pairs
 * @param {String} value
 * @return {CommentsFilter} Instance of `CommentsFilter`
 * @api public
 */

CommentsFilter.prototype.set = function (sort) {
  var old = this.$_filter;
  this.$_filter = sorts[sort] || sort;

  if (citizen.logged()) {
    store.set('comments-filter', this.get(), onsave.bind(this));
  }

  function onsave(err, ok) {
    if (err) return log('unable to save');
    log('saved');
  }

  if (old != this.$_filter) this.emit('change');
  return this;
}

/**
 * Get current sort
 *
 * @return {String}
 * @api public
 */

CommentsFilter.prototype.getSort = function() {
  return this.get().sort;
}
/**
 * Module dependencies.
 */

var citizen = require('citizen');
var Emitter = require('emitter');
var render = require('render');
var events = require('events');
var closest = require('closest');
var merge = require('merge-util');
var sorts = require('./sorts');
var store = require('store')();
var t = require('t');
var template = require('./comments-filter');
var o = require('query');

module.exports = CommentsFilter;

/**
 * Create a `CommentsFilter` instance
 */

function CommentsFilter() {
  if (!(this instanceof CommentsFilter)) {
    return new CommentsFilter();
  };

  this.build();
  this.switchOn();
}

/**
 * Mixin `LawsFilter` with `Emitter`
 */

Emitter(CommentsFilter.prototype);

/**
 * Build
 */

CommentsFilter.prototype.build = function() {

  this.$_filter = sorts.score;

  this.el = render.dom(template, { filter: this, sorts: sorts });
}

/**
 * Switch on events
 *
 * @api public
 */

CommentsFilter.prototype.switchOn = function() {
  this.events = events(this.el, this);
  this.events.bind('click .dropdown li a', 'onsortclick');
  this.on('change', this.onsortchange.bind(this));
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
  if (sort != this.$_filter.sort) {
    this.set(sort);
    this.emit('change', this.get());
  }
}

/**
 * Change sorting criteria
 *
 * @api public
 */

CommentsFilter.prototype.onsortchange = function(sort) {
  var btn = o('.btn strong', this.el);
  btn.innerHTML = t(sort.label);
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
  this.$_filter = sorts[sort];
}

/**
 * Render el
 */

CommentsFilter.prototype.render = function(el) {
  if (1 === arguments.length) {

    // if string, then query element
    if ('string' === typeof el) {
      el = o(el);
    };

    // if it's not currently inserted
    // at `el`, then append to `el`
    if (el !== this.el.parentNode) {
      el.appendChild(this.el);
    };

    // !!!: Should we return different things
    // on different conditions?
    // Or should we be consistent with
    // render returning always `this.el`
    return this;
  };

  return this.el;
}
/**
 * Module dependencies.
 */

var citizen = require('citizen');
var Emitter = require('emitter');
var render = require('render');
var sorts = require('./sorts');
var store = require('store')();
var t = require('t');
var template = require('./comments-filter')

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
  this.$_items = [];
  this.$_counts = [];

  // TODO: remove this hardcode and use a default sort (maybe by config?)
  this.$_filters = {};
  this.$_filters['sort'] = 'score';

  this.sorts = sorts;
  this.el = render(template, { filter: this });
  this.events = events(this.el, this);
}

/**
 * Switch on events
 *
 * @api public
 */

CommentsFilter.prototype.switchOn = function() {
  this.events.bind('click .dropdown li a', 'onsortchange');
}

/**
 * Click on a comments sort
 *
 * @api public
 */

CommentsFilter.prototype.onsortchange = function() {
  ev.preventDefault();

  var target = ev.delegateTarget || closest(ev.target, 'a');
  var sort = target.getAttribute('data-sort');
  if (sort != this.$_filters['sort']) {
    alert('change');
  } else {
    alert('no change');
  }
}

/**
 * Render el
 */

CommentsView.prototype.render = function(el) {
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
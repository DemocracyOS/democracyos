/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var render = require('render');
var events = require('events');
var bus = require('bus');
var classes = require('classes');
var template = require('./sidebar-container');
var filter = require('./filter');
var list = require('./list');
var lawsFilter = require('laws-filter');
var o = require('query');
var Stateful = require('stateful');
var log = require('debug')('democracyos:sidebar:view');

/**
 * Expose SidebarView
 */

module.exports = SidebarView;

/**
 * Create Sidebar List view container
 */

function SidebarView() {
  if (!(this instanceof SidebarView)) {
    return new SidebarView();
  };

  this.state('initializing');

  // Prep event handlers
  this.onfilterready = this.onfilterready.bind(this);

  this.el = render.dom(template);
  this.events = events(this.el, this);

  this.switchOn();
}

Stateful(SidebarView);

SidebarView.prototype.switchOn = function() {
  filter.ready(this.onfilterready);
  bus.on('vote', this.vote);
}

SidebarView.prototype.switchOff = function() {
  // intentionally left blank
}

SidebarView.prototype.onfilterready = function() {
  filter.render(o('#filter-container', this.el));
  list.ready(this.onlistready.bind(this));
};

SidebarView.prototype.onlistready = function() {
  list.render(o('#list-container', this.el));
  this.state('loaded');
};

SidebarView.prototype.render = function(el) {
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

SidebarView.prototype.vote = function (id) {
  list.vote(id);
}

SidebarView.prototype.items = function(index) {
  return lawsFilter.items()[index];
};

SidebarView.prototype.select = function(id) {
  var els = o.all('ul.nav.navlist li', this.el);
  var el = o('ul.nav.navlist li[data-id="' + id + '"]', this.el);

  for (var i = 0; i < els.length; i++) {
    classes(els[i]).remove('active');
  };
  if (el) {
    classes(el).add('active');
  }

  return this;
}

SidebarView.prototype.selected = function() {
  if (!this.items()) return null;

  var el = this.el.querySelector('ul.nav.navlist li.active');
  var id = el ? el.getAttribute('data-id') : null;

  return id ? get(this.items(), 'id === "%id"'.replace('%id', id)) : null;
}

/**
 * Handle errors
 *
 * @param {String} error
 * @return {SidebarView} Instance of `SidebarView`
 * @api public
 */

SidebarView.prototype.error = function(message) {
  // TODO: We should use `Error`s instead of
  // `Strings` to handle errors...
  // Ref: http://www.devthought.com/2011/12/22/a-string-is-not-an-error/
  this.state('error', message);
  log('error found: %s', message);

  // Unregister all `ready` listeners
  this.off('ready');
  return this;
}

function get(list, query) {
  var match;
  var test = new Function('_', 'return _.' + query);

  list.some(function(l) {
    if (test(l)) {
      match = l;
      return true;
    };
    return false;
  });
  return match || null;
}
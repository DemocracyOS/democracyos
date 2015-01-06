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
var StatefulView = require('stateful-view');
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

  StatefulView.call(this, template);
  this.filtercontainer = this.find('#filter-container');
  this.listcontainer = this.find('#list-container');
}

StatefulView(SidebarView);

SidebarView.prototype.switchOn = function() {
  filter.ready(this.bound('onfilterready'));
  bus.on('vote', this.vote);
}

SidebarView.prototype.switchOff = function() {
  bus.off('vote', this.vote);
}

SidebarView.prototype.onfilterready = function() {
  filter.appendTo(this.filtercontainer[0]);
  list.ready(this.onlistready.bind(this));
};

SidebarView.prototype.onlistready = function() {
  list.appendTo(this.listcontainer[0]);
  this.state('loaded');
};

SidebarView.prototype.vote = function (id) {
  list.vote(id);
}

SidebarView.prototype.items = function(index) {
  return lawsFilter.items()[index];
};

SidebarView.prototype.select = function(id) {
  var els = this.find('ul.nav.navlist li');
  var el = this.find('ul.nav.navlist li[data-id="' + id + '"]');

  els.removeClass('active');
  el.addClass('active');

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
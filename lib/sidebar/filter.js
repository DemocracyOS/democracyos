/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var render = require('render');
var events = require('events');
var empty = require('empty');
var filter = require('laws-filter');
var template = require('./filter-container');
var o = require('query');
var closest = require('closest');
var classes = require('classes');

function FilterView() {
  if (!(this instanceof FilterView)) {
    return new FilterView();
  };

  // Prep event handlers
  this.refresh = this.refresh.bind(this);

  this.build();
  this.switchOn();
}

Emitter(FilterView.prototype);

FilterView.prototype.build = function() {
  this.el = render.dom(template, { filter: filter });
};

FilterView.prototype.switchOn = function() {
  // View events
  this.events = events(this.el, this);
  this.events.bind('click #status-filter a.btn', 'onstatusclick');
  this.events.bind('click #sort-filter ul li', 'onsortclick');
  this.events.bind('click #hide-voted-filter input[name=hide-voted]', 'onhidevotedclick');

  // Behavior events
  filter.on('change', this.refresh);
}

FilterView.prototype.switchOff = function() {
  this.events.unbind();
  filter.off('change', this.refresh);
}

FilterView.prototype.refresh = function() {
  var old = this.el;
  this.switchOff();
  this.build();
  this.switchOn();
  if (old.parentNode) old.parentNode.replaceChild(this.el, old);
  old.remove();
  var obj = o('li[data-sort="closing-soon"]', this.el);
  if (filter.get('status') == 'closed') {
    classes(obj).add('hide');
    if (filter.get('sort') == 'closing-soon') filter.set('sort', 'newest-first');
  } else {
    classes(obj).remove('hide');
  }
};

FilterView.prototype.onstatusclick = function(ev) {
  ev.preventDefault();

  var target = ev.delegateTarget || closest(ev.target, '[data-status]', true);
  var status = target.getAttribute('data-status');
  
  filter.set('status', status);
}

FilterView.prototype.onsortclick = function(ev) {
  ev.preventDefault();

  var target = ev.delegateTarget || closest(ev.target, '[data-sort]', true);
  var sort = target.getAttribute('data-sort');
  
  filter.set('sort', sort);
}

FilterView.prototype.onhidevotedclick = function(ev) {
  ev.preventDefault();

  var target = ev.delegateTarget || closest(ev.target, '[type=checkbox]', true);
  var checked = !!target.checked;
  
  filter.set('hide-voted', checked);
}

FilterView.prototype.ready = function(fn) {
  filter.ready(fn);
  filter.ready(this.refresh);
}

FilterView.prototype.render = function(el) {
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

module.exports = new FilterView();
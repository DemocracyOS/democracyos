/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var render = require('render');
var events = require('events');
var filter = require('laws-filter');
var template = require('./filters');
var o = require('query');
var closest = require('closest');

function FilterView() {
  if (!(this instanceof FilterView)) {
    return new FilterView();
  };

  this.el = render.dom(template);
  this.events = events(this.el, this);

  this.switchOn();
}

Emitter(FilterView.prototype);

FilterView.prototype.switchOn = function() {
  // this.events.bind('click #status-filter a.btn', this.onstatuschange);
  // filter.on('change', this.onchange);
}

FilterView.prototype.switchOff = function() {
  // this.events.unbind();
}

FilterView.prototype.onstatuschange = function(ev) {
  ev.preventDefault();

  var target = ev.delegateTarget || closest(ev.target, '[data-status]');
  var status = target.getAttribute('data-status');
  filter.set('status', status);
}

FilterView.prototype.ready = function(fn) {
  filter.ready(fn);
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
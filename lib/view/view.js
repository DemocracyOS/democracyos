/**
 * Module dependencies.
 */

var o = require('dom');
var Emitter = require('emitter');
var inherit = require('inherit');
var inserted = require('inserted');
var removed = require('removed');
var render = require('render');

module.exports = View;

/**
 * Constructor
 */

function View(template, locals) {
  if (!(this instanceof View))
    return inherit(template, View);

  this.template = template;
  this.locals = locals || {};
  this.events = [];
  this.build();
}

/**
 * Inherit from Emitter
 */

inherit(View, Emitter);

/**
 * Basic build
 */

View.prototype.build = function() {
  this.el = o(render.dom(this.template, this.locals));
  this._bound = {};
  inserted(this.el[0], this._oninsert.bind(this));
};

/**
 * Remove View's `el`
 */

View.prototype.remove = function() {
  this.el.remove();
};

/**
 * Default handler when
 * `el` is inserted
 */

View.prototype._oninsert = function() {
  this.emit('insert');
  if (this.switchOn && 'function' === typeof this.switchOn) {
    this.switchOn();
  }
  removed(this.el[0], this._onremove.bind(this));
};

/**
 * Default handler when
 * `el` is removed
 */

View.prototype._onremove = function() {
  this.emit('remove');
  this.unbind();
  this.off();
  if (this.switchOff && 'function' === typeof this.switchOff) {
    this.switchOff();
  }
  inserted(this.el[0], this._oninsert.bind(this));
};

/**
 * Find an element inside `el`
 * by a given selector
 */

View.prototype.find = function(selector, context) {
  return this.el.find(selector, context);
};

/**
 * Bind a method handler to an event
 */

View.prototype.bind = function (event, selector, fn, capture) {
  if ('string' === typeof(fn)) {
    fn = this.bound(fn);
  }

  this.events.push({
    event: event,
    selector: selector,
    fn: fn,
    capture: capture
  });

  return this.el.on(event, selector, fn, capture);
};

/**
 * Unbind a method handler to an event
 */

View.prototype.unbind = function (event, selector, fn, capture) {
  if (arguments.length == 0) {
    this.unbindAll();
  }

  if ('string' === typeof(fn)) {
    fn = this.bound(fn);
  }
  return this.el.off(event, selector, fn, capture);
};

View.prototype.unbindAll = function() {
  this.events.forEach(function (ev) {
    this.unbind(ev.event, ev.selector, ev.fn, ev.capture);
  }, this);
};

View.prototype.appendTo = function(el) {
  return this.el.appendTo(el);
};

View.prototype.replace = function(el) {
  this.wrapper = el;
  this.emit('replace', o(this.wrapper));
  return this.refresh();
};

View.prototype.refresh = function() {
  this.wrapper = this.wrapper || this.el[0].parentNode;
  if (!this.wrapper) return;
  o(this.wrapper).empty().append(this.render());
  return this;
};

View.prototype.render = function() {
  this.emit('render');
  return this.el;
};

View.prototype.bound = function(method) {
  if (!this._bound[method]) {
    this._bound[method] = this[method].bind(this);
  }

  return this._bound[method];
};

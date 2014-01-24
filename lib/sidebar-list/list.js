/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var render = require('render');
var events = require('events');
var empty = require('empty');
var o = require('query');
var classes = require('classes');
var filter = require('laws-filter');
var listItem = require('./list-item');
var list = require('./list-container');
var log = require('debug')('democracyos:sidebar-list:list');

function ListView() {
  if (!(this instanceof ListView)) {
    return new ListView();
  };

  this.state('initializing');

  this.el = render.dom(list);
  this.events = events(this.el, this);
  this.type = 'law';
  
  this.switchOn();
  this.reload();
  filter.ready(this.onfilterready.bind(this));
}

Emitter(ListView.prototype);

ListView.prototype.switchOn = function () {
  // filter.on('reload', this.reload);
  // this.state('loaded');
};

ListView.prototype.switchOff = function () {
  // filter.off('reload');
};

ListView.prototype.onfilterready = function () {
  this.state('loaded');
};

ListView.prototype.reload = function () {
  var self = this;

  filter.ready(function () {
    empty(self.el);
    filter.items().forEach(function (item) {
      this.append(item)
    }, self);
  });
}

ListView.prototype.append = function (item) {
  var itemEl = render.dom(listItem, { item: item, listType: this.type });
  this.el.appendChild(itemEl);
}

/**
 * Emit `ready` if collection has
 * completed a cycle of request
 *
 * @param {Function} fn
 * @return {Laws} Instance of `Laws`
 * @api public
 */

ListView.prototype.ready = function (fn) {
  var self = this;

  function done() {
    if ('loaded' === self.state()) {
      return fn();
    }
  }

  if ('loaded' === this.state()) {
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
 * @return {View|String} Instance of `View` or current `state`
 * @api public
 */

ListView.prototype.state = function (state, message) {
  if (0 === arguments.length) {
    return this.$_state;
  }

  log('state is now %s', state);
  this.$_state = state;
  this.emit(state, message);
  return this;
};

ListView.prototype.render = function(el) {
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

module.exports = new ListView();
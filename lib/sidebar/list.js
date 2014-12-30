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
var template = require('./list-container');
var check = require('./check');
var log = require('debug')('democracyos:sidebar:list');

function ListView() {
  if (!(this instanceof ListView)) {
    return new ListView();
  };

  this.type = 'law';

  // Prep event handlers
  this.refresh = this.refresh.bind(this);

  this.build();
  this.switchOn();
}

Emitter(ListView.prototype);

ListView.prototype.build = function () {
  this.el = render.dom(template);
};

ListView.prototype.switchOn = function () {
  this.events = events(this.el, this);
  filter.on('reload', this.refresh);
};

ListView.prototype.switchOff = function () {
  this.events.unbind();
  filter.off('reload', this.refresh);
};

ListView.prototype.refresh = function () {
  var old = this.el;
  this.switchOff();
  this.build();
  this.switchOn();

  // Build list contents
  empty(this.el);
  filter.items().forEach(function (item) {
    this.append(item)
  }, this);

  if (old.parentNode) old.parentNode.replaceChild(this.el, old);
  old.remove();
}

ListView.prototype.vote = function (id) {
  var itemEl = o('li[data-id="' + id + '"]', this.el)
  var itemLink = o('a[href="/' + this.type + '/' + id + '"]', itemEl);
  classes(itemLink).add('voted');
  var itemBadges = o('.item-badges', itemLink);
  itemBadges.appendChild(render.dom(check));
  filter.vote(id);
}

ListView.prototype.append = function (item) {
  var itemEl = render.dom(listItem, { item: item, listType: this.type });
  this.el.appendChild(itemEl);
}

ListView.prototype.ready = function (fn) {
  filter.ready(fn);
  filter.ready(this.refresh);
}

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
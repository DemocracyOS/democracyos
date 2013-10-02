/**
 * Module dependencies.
 */

var domify = require('domify');
var blockList = require('./list-block');
var listItem = require('./list-item');
var Emitter = require('emitter');
var classes = require('classes');
var t = require('t');

/**
 * Expose View
 */

module.exports = View;

/**
 * Create Sidebar List view container
 */

function View(items, type) {
  if (!(this instanceof View)) {
    return new View(items, type);
  };

  this.el = domify(blockList({ type: type, t: t }));
  this.items = items || [];
  this.type = type || 'law';
}

Emitter(View.prototype);

View.prototype.set = function(v) {
  this.items = v;
  return this.build();
}

View.prototype.add = function(i) {
  this.items.push(i);
  return this;
}

View.prototype.render = function() {
  return this.el;
}

View.prototype.build = function() {
  var list = this.el.querySelector('ul.nav.navlist');

  this.items.forEach(function(item, index) {
    var itemEl = domify(listItem({ item: item, listType: this.type }));
    list.appendChild(itemEl);
  }, this);

  return this;
}

View.prototype.select = function(id) {
  var els = this.el.querySelectorAll('ul.nav.navlist li');
  var el = this.el.querySelector('ul.nav.navlist li[data-id="' + id + '"]');

  if (el) {
    for (var i = 0; i < els.length; i++) {
      classes(els[i]).remove('active');
    };
    classes(el).add('active');
  }
  
  return this;
}
/**
 * Module dependencies.
 */

var View = require('view');
var render = require('render');
var o = require('dom');
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
  View.call(this, template);
}

View(ListView);

ListView.prototype.switchOn = function () {
  filter.on('reload', this.bound('refresh'));
};

ListView.prototype.switchOff = function () {
  filter.off('reload', this.bound('refresh'));
};

ListView.prototype.refresh = function () {
  var old = this.el[0];
  this.switchOff();
  this.build();
  this.switchOn();

  // Build list contents
  this.el.empty();
  filter.items().forEach(function (item) {
    this.append(item)
  }, this);

  if (old.parentNode) old.parentNode.replaceChild(this.el[0], old);
  old.remove();
}

ListView.prototype.vote = function (id) {
  var itemEl = this.find('li[data-id="' + id + '"]');
  var itemLink = this.find('a[href="/' + this.type + '/' + id + '"]');
  itemLink.addClass('voted');
  var itemBadges = itemLink.find('.item-badges');
  itemBadges.append(render.dom(check));
  filter.vote(id);
}

ListView.prototype.append = function (item) {
  var itemEl = render.dom(listItem, { item: item, listType: this.type });
  this.el.append(itemEl);
}

ListView.prototype.ready = function (fn) {
  filter.ready(fn);
  filter.ready(this.bound('refresh'));
}

module.exports = new ListView();
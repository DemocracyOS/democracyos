/**
 * Module dependencies.
 */

var View = require('view');
var filter = require('laws-filter');
var listItem = require('./list-item');
var template = require('./list-container');
var check = require('./check');
var render = require('render');
var log = require('debug')('democracyos:sidebar:list');

function ListView() {
  if (!(this instanceof ListView)) {
    return new ListView();
  };

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
  // Build list contents
  this.el.empty();

  filter.items().forEach(function (item) {
    this.append(item)
  }, this);
}

ListView.prototype.vote = function (id) {
  var itemEl = this.find('li[data-id=":id"]'.replace(':id', id));
  var itemLink = itemEl.find('a[href="/law/:id"]'.replace(':id', id));
  itemLink.addClass('voted');
  var itemBadges = itemLink.find('.item-badges');
  itemBadges.append(render.dom(check));

  filter.vote(id);
}

ListView.prototype.append = function (item) {
  var itemEl = render.dom(listItem, { item: item });
  this.el.append(itemEl);
}

ListView.prototype.ready = function (fn) {
  filter.ready(fn);
  filter.ready(this.bound('refresh'));
}

module.exports = new ListView();
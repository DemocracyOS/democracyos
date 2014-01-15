/**
 * Module dependencies.
 */

var filter = require('laws-filter')();
var template = require('./filters.jade');
var render = require('render');
var events = require('events');

module.exports = function FilterView() {
  if (!(this instanceof FilterView)) {
    return new FilterView();
  };

  this.el = render(template);
  this.events = events(this.el, this);
}

FilterView.prototype.switchOn = function() {
  this.events.bind('click .open', this.onopenclick)
}

FilterView.prototype.onopenclick = function(ev) {
  ev.preventDefault();

  filter.set('status', "open");
}


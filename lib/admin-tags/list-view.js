/**
 * Module dependencies.
 */

var list = require('./list-template');
var tags = require('tags');
var Emitter = require('emitter');
var events = require('events');
var render = require('render');
var o = require('query');
var diacritics = require('diacritics').remove;
var log = require('debug')('democracyos:admin-tags:list-view');

/**
 * Expose ListView
 */

module.exports = ListView;

/**
 * Creates a list view of tags
 */

function ListView() {
  if (!(this instanceof ListView)) {
    return new ListView();
  };

  this.build();
  this.switchOn();
}

/**
 * Mixin with `Emitter`
 */

Emitter(ListView.prototype);


/**
 * Turn on event bindings
 */

ListView.prototype.switchOn = function() {
  this.events = events(this.el, this);
}

/**
 * Turn off event bindings
 */

ListView.prototype.switchOff = function() {
  this.events.unbind();
}

/**
 * Build list element into `this.el`
 *
 * @return {ListView} self
 * @api public
 */

ListView.prototype.build = function() {
  function sort(a, b) {
    if (diacritics(a.name.toLowerCase()) < diacritics(b.name.toLowerCase())) {
      return -1;
    }
    if (diacritics(a.name.toLowerCase()) > diacritics(b.name.toLowerCase())) {
      return 1;
    }
    return 0;
  }

  this.el = render.dom(list, {
    tags: tags.get().sort(sort)
  });

  return this;
}

/**
 * Renders to provided `el`
 * or delivers view's `el`
 *
 * @param {Element} el
 * @return {ListView|Element}
 * @api public
 */

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

    return this;
  };

  return this.el;
}
/**
 * Module dependencies.
 */

var marked = require('marked');
var md = require('./tos.md');
var template = require('./tos-template');
var render = require('render');
var o = require('query');
var log = require('debug')('democracyos:help-tos');

/**
 * Expose TOSView
 */

module.exports = TOSView;

/**
 * Creates a TOS view
 */

function TOSView() {
  if (!(this instanceof TOSView)) {
    return new TOSView();
  };

  this.el = render.dom(template, { md: marked(md) });
}

/**
 * Renders to provided `el`
 * or delivers view's `el`
 *
 * @param {Element} el
 * @return {TOSView|Element}
 * @api public
 */

TOSView.prototype.render = function(el) {
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
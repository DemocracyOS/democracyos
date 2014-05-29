/**
 * Module dependencies.
 */

var marked = require('marked');
var md = require('./faq.md');
var template = require('./faq-template');
var render = require('render');
var o = require('query');
var log = require('debug')('democracyos:help-faq');

/**
 * Expose FAQView
 */

module.exports = FAQView;

/**
 * Creates a FAQ view
 */

function FAQView() {
  if (!(this instanceof FAQView)) {
    return new FAQView();
  };

  this.el = render.dom(template, { md: marked(md) });
}

/**
 * Renders to provided `el`
 * or delivers view's `el`
 *
 * @param {Element} el
 * @return {FAQView|Element}
 * @api public
 */

FAQView.prototype.render = function(el) {
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
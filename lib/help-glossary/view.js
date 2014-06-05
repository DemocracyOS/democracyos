/**
 * Module dependencies.
 */

var marked = require('marked');
var md = require('./glossary.md');
var template = require('./glossary-template');
var render = require('render');
var o = require('query');
var log = require('debug')('democracyos:help-glossary');

/**
 * Expose GlossaryView
 */

module.exports = GlossaryView;

/**
 * Creates a Glossary view
 */

function GlossaryView(word) {
  if (!(this instanceof GlossaryView)) {
    return new GlossaryView(word);
  };

  this.word = word;
  this.build();
}

GlossaryView.prototype.build = function() {
  this.el = render.dom(template, { md: marked(md) });
    
};

/**
 * Renders to provided `el`
 * or delivers view's `el`
 *
 * @param {Element} el
 * @return {GlossaryView|Element}
 * @api public
 */

GlossaryView.prototype.render = function(el) {
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
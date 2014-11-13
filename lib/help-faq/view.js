/**
 * Module dependencies.
 */

var marked = require('marked');
var md = require('./faq.md');
var template = require('./faq-template');
var View = require('view');

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

  View.call(this, template, { md: marked(md) });
}

View(FAQView);
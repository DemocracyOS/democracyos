/**
 * Module dependencies.
 */

var marked = require('marked');
var md = require('./tos.md');
var template = require('./template');
var View = require('view');

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

  View.call(this, template, { md: marked(md) });
}

View(TOSView);
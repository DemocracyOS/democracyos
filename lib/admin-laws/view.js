/**
 * Module dependencies.
 */

var laws = require('laws');
var template = require('./template');
var View = require('view');

/**
 * Expose LawsListView
 */

module.exports = LawsListView;

/**
 * Creates a list view of laws
 */

function LawsListView() {
  if (!(this instanceof LawsListView)) {
    return new LawsListView();
  };

  var options = { laws: laws.get() };
  View.call(this, template, options);
}

/**
 * Inherit from `View`
 */

View(LawsListView);
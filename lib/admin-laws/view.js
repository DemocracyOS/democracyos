/**
 * Module dependencies.
 */

var laws = require('laws');
var template = require('./template');
var page = require('page');
var List = require('list.js');
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

LawsListView.prototype.switchOn = function() {
  this.bind('click', '.btn.new', this.bound('onaddtopic'));
  this.list = new List('laws-wrapper', { valueNames: ['law-title', 'law-id', 'law-date'] });
};

LawsListView.prototype.onaddtopic = function() {
  page('/admin/laws/create');
};
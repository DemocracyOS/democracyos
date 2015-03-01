/**
 * Module dependencies.
 */

var diacritics = require('diacritics').remove;
var page = require('page');
var List = require('list.js');
var tags = require('tags');
var template = require('./template');
var View = require('view');

/**
 * Expose TagsListView
 */

module.exports = TagsListView;

/**
 * Creates a list view of tags
 */

function TagsListView() {
  if (!(this instanceof TagsListView)) {
    return new TagsListView();
  };

  this.tags();
  View.call(this, template, this.options);
}

/**
 * Inherit from `View`
 */

View(TagsListView);

TagsListView.prototype.switchOn = function() {
  this.bind('click', '.btn.new', this.bound('onaddtag'));
  this.list = new List('tags-wrapper', { valueNames: ['tag-title'] });
}

/**
 * Build list element into `this.el`
 *
 * @return {TagsListView} self
 * @api public
 */

TagsListView.prototype.tags = function() {
  function sort(a, b) {
    if (diacritics(a.name.toLowerCase()) < diacritics(b.name.toLowerCase())) {
      return -1;
    }
    if (diacritics(a.name.toLowerCase()) > diacritics(b.name.toLowerCase())) {
      return 1;
    }
    return 0;
  }

  this.options = {
    tags: tags.get().sort(sort)
  };
}

TagsListView.prototype.onaddtag = function() {
  page('/admin/tags/create');
}
var template = require('./template');
var View = require('view');
var dom = require('dom');
var Quill = require('quill');

module.exports = RichTextView;

function RichTextView(el) {
  if (!(this instanceof RichTextView)) {
    return new RichTextView(el);
  }

  View.call(this, template);

  if (el) {
    this.original = dom(el);
  }

  this.editor = new Quill(this.find('#editor')[0], {
    modules: {
      'authorship': { authorId: 'galadriel', enabled: true },
      'multi-cursor': true,
      'toolbar': { container: this.find('#toolbar')[0] },
      'link-tooltip': true
    },
    theme: 'snow'
  });
};

View(RichTextView);

RichTextView.prototype.render = function() {
  if (this.original) {
    this.original.addClass('hide');
    this.el.insertAfter(this.original);
  }

  return View.prototype.render.call(this);
};
var template = require('./template');
var View = require('view');
var dom = require('dom');
var Quill = require('quill');

var defaults = {
  toolbar: {
    fontFace: false,
    fontSize: false,
    fontWidth: true
  },
  theme: 'snow'
};

module.exports = RichTextView;

function RichTextView(el, options) {
  if (!(this instanceof RichTextView)) {
    return new RichTextView(el, options);
  }

  // The original input or textarea element
  this.input = 'string' === typeof el ? dom(el) : el;

  // Settings merged with options provided by callee
  // fixme: i can't find a component that extends the defaults object with the options object.
  //this.settings = options || {};
  this.settings = defaults;

  View.call(this, template, this.settings);

  this.editor = new Quill(this.find('#editor')[0], {
    modules: {
      'toolbar': { container: this.find('#toolbar')[0] },
      'link-tooltip': true,
      'image-tooltip': true
    },
    theme: this.settings.theme
  });

  if (this.input.val()) this.editor.setHTML(this.input.val());
  this.render();
};

View(RichTextView);

RichTextView.prototype.switchOn = function() {
  this.editor.on('text-change', this.bound('ontextchange'));
};

RichTextView.prototype.ontextchange = function(delta, source) {
  var contents = this.editor.getHTML();
  this.input.val(contents);
};

RichTextView.prototype.render = function() {
  if (this.input) {
    this.input.addClass('hide');
    this.el.insertAfter(this.input);
  }

  return View.prototype.render.call(this);
};
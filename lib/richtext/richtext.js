var template = require('./template');
var View = require('view');
var dom = require('dom');
var Quill = require('quill');
var merge = require('merge-util');
var defaults = {
  toolbar: {
    fontFace: false,
    fontSize: false,
    fontWidth: true,
    image: true,
    video: true,
    link: true,
    bullet: true,
    list: true
  },
  theme: 'snow'
};

module.exports = RichTextView;

/**
 * Wraps an input element and converts it in a Quill WYSIWYG control
 * @param {String|HTMLInputElement} Selector or domified single element
 * @param {Object} Customization options
 *
 * Usage:
 *   var richtext = require('richtext');
 *   var input = dom('input#description');
 *   richtext(input);
 *
 */
function RichTextView(el, options) {
  if (!(this instanceof RichTextView)) {
    return new RichTextView(el, options);
  }

  // The original input or textarea element
  this.input = 'string' === typeof el ? dom(el) : el;

  // Settings merged with options provided by callee
  this.settings = merge(defaults, options, { inheritance: true });

  // Inherit from base view
  View.call(this, template, this.settings);

  // Set up Quill instance
  var modules = {
      'toolbar': { container: this.find('#toolbar')[0] },
  };

  if (this.settings.toolbar.link) modules['link-tooltip'] = true;
  if (this.settings.toolbar.image) modules['image-tooltip'] = true;
  if (this.settings.toolbar.video) modules['video-tooltip'] = true;

  // Create Quill object
  this.editor = new Quill(this.find('#editor')[0], {
    modules: modules,
    theme: this.settings.theme
  });

  // If original input element has value, set it to Quill object
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

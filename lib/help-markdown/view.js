/**
 * Module dependencies.
 */

var dosMarkdown = require('markdown');
var marked = require('marked');
var t = require('t');
var template = require('./template');
var View = require('view');


/**
 * Expose MarkdownView.
 */

module.exports = MarkdownView;

/**
 * DemocracyOS markdown guide MarkdownView
 *
 * @return {MarkdownView} `MarkdownView` instance.
 * @api public
 */

function MarkdownView() {
  if (!(this instanceof MarkdownView)) {
    return new MarkdownView();
  };

  View.call(this, template, { marked: marked, dosMarkdown: dosMarkdown });
  this.playground = this.find('textarea.playground');
  this.result = this.find('.result');
}

/**
 * Inherit from `View`
 */

View(MarkdownView)

/**
 * Switch on events
 *
 * @api public
 */

MarkdownView.prototype.switchOn = function() {
  this.bind('keyup', 'textarea.playground', 'onchange');
};

/**
 * Switch off events
 *
 * @api public
 */

MarkdownView.prototype.switchOff = function() {
  this.unbind('keyup', 'textarea.playground', 'onchange');
}

/**
 * On text change
 *
 * @param {Object} data
 * @api public
 */

 MarkdownView.prototype.onchange = function(ev) {
  var value = this.playground.value();

  if (value != '') {
    value = dosMarkdown(value);
  } else {
    value = t('markdown.playground.text');
  }
  this.result.html(value)
};
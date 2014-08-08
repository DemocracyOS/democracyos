/**
 * Module dependencies.
 */

var marked = require('marked');
var md = require('./glossary.md');
var o = require('dom');
var t = require('t');
var template = require('./template');
var View = require('view');

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
  View.call(this, template, { md: marked(md) })

  if (!this.word) return;
  this.elWord = o('#' + this.word, this.el);
  this.elWord.addClass('selected');
  var back = o(document.createElement('a'));
  back.addClass('back').addClass('pull-right');
  back.attr('href', '#');
  back.html(t('Back'));
  this.elWord.append(back);
}

View(GlossaryView);

GlossaryView.prototype.switchOn = function() {
  this.bind('click', '.back', this.bound('onback'));
};

GlossaryView.prototype.switchOff = function() {
  this.unbind('click', '.back', this.bound('onback'));
};

GlossaryView.prototype.onback = function(ev) {
  ev.preventDefault();
  window.history.go(-1);
};

GlossaryView.prototype.scroll = function() {
  if (this.elWord) this.elWord[0].scrollIntoView();
};
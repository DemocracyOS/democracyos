/**
 * Module dependencies.
 */

var marked = require('marked');
var md = require('./glossary.md');
var template = require('./glossary-template');
var render = require('render');
var events = require('events');
var classes = require('classes');
var o = require('query');
var t = require('t');
var log = require('debug')('democracyos:help-glossary');

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
  this.build();
  this.switchOn();
}

GlossaryView.prototype.build = function() {
  this.el = render.dom(template, { md: marked(md) });
  if (!this.word) return;
  this.elWord = o('#' + this.word, this.el);
  classes(this.elWord).add('selected');
  var back = document.createElement('a');
  classes(back).add('back').add('pull-right');
  back.href = '#';
  back.innerHTML = t('Back');
  this.elWord.appendChild(back);
};

GlossaryView.prototype.switchOn = function() {
  this.events = events(this.el, this);
  this.events.bind('click .back', 'onback');
};

GlossaryView.prototype.onback = function(ev) {
  ev.preventDefault();
  window.history.go(-1);
};

GlossaryView.prototype.scroll = function() {
  if (this.elWord) this.elWord.scrollIntoView();
};

/**
 * Renders to provided `el`
 * or delivers view's `el`
 *
 * @param {Element} el
 * @return {GlossaryView|Element}
 * @api public
 */

GlossaryView.prototype.render = function(el) {
  if (1 === arguments.length) {

    // if string, then query element
    if ('string' === typeof el) {
      el = o(el);
    };

    // if it's not currently inserted
    // at `el`, then append to `el`
    if (el !== this.el.parentNode) {
      el.appendChild(this.el);
    };

    return this;
  };

  return this.el;
}
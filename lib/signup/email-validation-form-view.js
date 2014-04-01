/*
 * Module dependencies.
 */

var t = require('t');
var Emitter = require('emitter');
var domify = require('domify');
var render = require('render');
var empty = require('empty');
var events = require('events');
var classes = require('classes');
var serialize = require('serialize');
var regexps = require('regexps');
var form = require('./email-validation-complete');

/**
 * Expose FormView.
 */

module.exports = FormView;

/**
 * Proposal Comments view
 *
 * @return {FormView} `FormView` instance.
 * @api public
 */

function FormView () {
  if (!(this instanceof FormView)) {
    return new FormView();
  };

  this.el = render.dom(form);
}

/**
 * Mixin `Emitter` with `FormView`
 */

Emitter(FormView.prototype);

/**
 * Render proposal comments
 * 
 * @return {FormView} `FormView` instance.
 * @api public
 */

FormView.prototype.render = function() {
  return this.el;
}

/**
 * Fill errors list
 *
 * @param {Array} errors
 * @api public
 */

FormView.prototype.errors = function(errors) {
  var ul = this.el.querySelector('ul.form-errors');

  if (!arguments.length) return empty(ul);

  errors.forEach(function(e) {
    var li = document.createElement('li');
    li.innerHTML = e;
    ul.appendChild(li);
  });

  var success = this.el.querySelector('#email-validation-message');
  classes(ul).remove('hide');
  classes(success).add('hide');
}
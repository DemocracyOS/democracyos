/*
 * Module dependencies.
 */

var t = require('t');
var Emitter = require('emitter');
var domify = require('domify');
var empty = require('empty');
var events = require('events');
var serialize = require('serialize');
var regexps = require('regexps');
var form = require('./signup-form');

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

  this.form = domify(form({ t: t }));

  this.events = events(this.form, this);
  this.events.bind('submit');

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
  return this.form;
}

/**
 * Handle `onsubmit` form event
 *
 * @param {Event} ev
 * @api private
 */

FormView.prototype.onsubmit = function(ev) {
  ev.preventDefault();
  
  // Clean errors list
  this.errors();

  // Serialize form
  var data = serialize.object(this.form);
  
  // Check for errors in data
  var errors = this.validate(data);

  // If errors, show and exit
  if (errors.length) {
    this.errors(errors);
    return;
  };

  // Deliver form submit
  this.emit('submit', data);
}

/**
 * Validate form's fields
 *
 * @param {Object} data
 * @return {Array} of Errors
 * @api public
 */

FormView.prototype.validate = function(data) {
  var errors = [];
  if (!regexps.email.test(data.email)) {
    errors.push('Email is not valid.');
  };
  return errors;
}

/**
 * Fill errors list
 *
 * @param {Array} errors
 * @api public
 */

FormView.prototype.errors = function(errors) {
  var ul = this.form.querySelector('ul.form-errors');

  if (!arguments.length) return empty(ul);

  errors.forEach(function(e) {
    var li = document.createElement('li');
    li.innerText = e;
    ul.appendChild(li);
  });
}
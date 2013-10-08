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
var form = require('./form');

/**
 * Expose View.
 */

module.exports = View;

/**
 * Signin view
 *
 * @return {View} `View` instance.
 * @api public
 */

function View () {
  if (!(this instanceof View)) {
    return new View();
  };

  this.el = domify(form({ t: t }));

  this.events = events(this.el, this);
  this.events.bind('submit');

}

/**
 * Mixin `Emitter` with `View`
 */

Emitter(View.prototype);

/**
 * Render proposal comments
 * 
 * @return {View} `View` instance.
 * @api public
 */

View.prototype.render = function() {
  return this.form;
}

/**
 * Handle `onsubmit` form event
 *
 * @param {Event} ev
 * @api private
 */

View.prototype.onsubmit = function(ev) {
  ev.preventDefault();
  
  // Clean errors list
  this.errors();

  // Serialize form
  var data = serialize.object(this.el);
  
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

View.prototype.validate = function(data) {
  var errors = [];
  if (!data.password.length) {
    errors.push('Password is required.');
  };
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

View.prototype.errors = function(errors) {
  var ul = this.el.querySelector('ul.form-errors');

  if (!arguments.length) return empty(ul);

  errors.forEach(function(e) {
    var li = document.createElement('li');
    li.innerText = e;
    ul.appendChild(li);
  });
}
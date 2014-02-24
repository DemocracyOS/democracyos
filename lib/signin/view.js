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
var o = require('query');

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
  this.events.bind('submit form');

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

View.prototype.render = function(el) {
  if (1 === arguments.length) {

    // if string, then query element
    if ('string' === typeof el) {
      el = document.querySelector(el);
    };

    // if it's not currently inserted
    // at `el`, then append to `el`
    if (el !== this.el.parentNode) {
      el.appendChild(this.el);
    };

    // !!!: Should we return different things
    // on different conditions?
    // Or should we be consistent with
    // render returning always `this.el`
    return this;
  };

  return this.el;
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

  var form = this.el.querySelector('form');
  // Serialize form
  var data = serialize.object(form);
  
  // Check for errors in data
  var errors = this.validate(data);

  // If errors, show and exit
  if (errors.length) {
    this.errors(errors);
    return;
  };

  var submit = o('input[type="submit"]', this.el);
  submit.disabled = true;

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
    errors.push(t('Password is required'));
  };
  if (!regexps.email.test(data.email)) {
    errors.push(t('Email is not valid'));
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
    li.innerHTML = e;
    ul.appendChild(li);
  });
}
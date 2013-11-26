/**
 * Module dependencies.
 */

var password = require('./password-template');
var serialize = require('serialize');
var Emitter = require('emitter');
var regexps = require('regexps');
var request = require('request');
var events = require('events');
var render = require('render');
var t = require('t');

/**
 * Expose PasswordView
 */

module.exports = PasswordView;

/**
 * Creates a password edit view
 */

function PasswordView() {
  if (!(this instanceof PasswordView)) {
    return new PasswordView();
  };

  this.el = render.dom(password);

  this.events = events(this.el, this);
  this.switchOn();
}

/**
 * Mixin with `Emitter`
 */

Emitter(PasswordView.prototype);


/**
 * Turn on event bindings
 */

PasswordView.prototype.switchOn = function() {
  this.events.bind('submit form');
  this.on('submit', this.formsubmit.bind(this));
  this.on('success', this.onsuccess.bind(this));
  this.on('error', this.onerror.bind(this));
}

/**
 * Turn off event bindings
 */

PasswordView.prototype.switchOff = function() {
  this.events.unbind();
  this.off();
}

/**
 * Handle `onsubmit` form event
 *
 * @param {Event} ev
 * @api private
 */

PasswordView.prototype.onsubmit = function(ev) {
  ev.preventDefault();
  
  // Clean errors list
  this.errors();

  // Serialize form
  var form = o('form', this.el);
  var data = serialize.object(form);
  
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
 * Handle `submit` event to
 * perform POST request with
 * data
 *
 * @param {Event} ev
 * @api private
 */

PasswordView.prototype.formsubmit = function(data) {  
  request
  .post('/settings/password')
  .send(data)
  .end(function(err, res) {
    if (err || !res.ok) {
      return log('Fetch error: %s', err || res.error);
    };
    if (res.body && res.body.error) {
      return view.emit('error', res.body.error);
    };

    view.emit('success', res.body);
  });
}

/**
 * Handle `error` event with
 * logging and display
 *
 * @param {String} error
 * @api private
 */

PasswordView.prototype.onerror = function(error) {
  log('Error: %o', error);
  this.errors([error]);
}

/**
 * Handle `error` event with
 * logging and display
 *
 * @param {String} error
 * @api private
 */

PasswordView.prototype.onsuccess = function() {
  log('Password updated');
  this.messages(['Your password was successfuly updated']);
}

/**
 * Validate form's fields
 *
 * @param {Object} data
 * @return {Array} of Errors
 * @api public
 */

PasswordView.prototype.validate = function(data) {
  var errors = [];
  if (!data.firstName.length) {
    errors.push(t('A first name is required'));
  };
  if (!data.lastName.length) {
    errors.push(t('A last name is required'));
  };
  if (!regexps.email.test(data.email)) {
    errors.push(t('Email is not valid'));
  };
  return errors;
}

/**
 * Fill messages list
 *
 * @param {Array} msgs
 * @param {string} type
 * @api public
 */

PasswordView.prototype.messages = function(msgs, type) {
  var ul = o('ul.form-messages', this.el);

  if (!arguments.length) return empty(ul);

  msgs.forEach(function(m) {
    var li = document.createElement('li');
    li.innerHTML = m;
    classes(li).add(type || 'error');
    ul.appendChild(li);
  });
}

/**
 * Renders to provided `el`
 * or delivers view's `el`
 *
 * @param {Element} el
 * @return {PasswordView|Element}
 * @api public
 */

PasswordView.prototype.render = function(el) {
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
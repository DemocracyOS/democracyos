/**
 * Module dependencies.
 */

var password = require('./password-template');
var serialize = require('serialize');
var classes = require('classes');
var Emitter = require('emitter');
var request = require('request');
var events = require('events');
var render = require('render');
var empty = require('empty');
var o = require('query');
var t = require('t');
var log = require('debug')('democracyos:settings-password');

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
  this.messages();

  // Serialize form
  var form = o('form', this.el);
  var data = serialize.object(form);
  
  // Check for errors in data
  var errors = this.validate(data);

  // If errors, show and exit
  if (errors.length) {
    this.messages(errors);
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
  var view = this;

  request
  .post('/settings/password')
  .send(data)
  .end(function(err, res) {
    if (err || !res.ok) {
      return log('Fetch error: %o', err || res.error), view.emit('error', res.text);
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
  this.messages([error]);
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
  this.messages([t('Your password was successfuly updated')], 'success');
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
  if (!data.password.length) {
    errors.push(t('Password is not good enough'));
  };
  if (data.password !== data.confirm_password) {
    errors.push(t('Passwords do not match'));
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
    if (!m) return;
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
/*
 * Module dependencies.
 */

var citizen = require('citizen');
var dom = require('dom');
var FormView = require('form-view');
var template = require('./template');
var page = require('page');
var t = require('t');
var jwt = require('jwt');

/**
 * Expose SigninForm.
 */

module.exports = SigninForm;

/**
 * Signin SigninForm
 *
 * @return {SigninForm} `SigninForm` instance.
 * @api public
 */

function SigninForm () {
  if (!(this instanceof SigninForm)) {
    return new SigninForm();
  }

  FormView.call(this, template);
}

/**
 * Inherit from `FormView`
 */

FormView(SigninForm);

SigninForm.prototype.switchOn = function () {
  this.on('success', this.bound('onsuccess'));
};

/**
 * Show success message
 */
SigninForm.prototype.onsuccess = function (res) {
  var payload = JSON.parse(res.text);

  if (payload.token) {
    jwt.setToken(payload.token);
  }

  citizen.set(payload.user);

  var sidebarItem = dom('.nav-proposal .sidebar-nav .nav.navlist li.active');
  if (sidebarItem.length) {
    var id = sidebarItem.attr('data-id');
    page('/law/' + id);
  } else {
    page('/');
  }
};

/**
 * Handle http response to show message to the user.
 *
 * @returns {Mixed}
 * @override from {FormView}
 */
SigninForm.prototype.response = function (err, res) {
  if (err) {
    return this.errors([err]);
  }

  if (!res.ok) {
    return this.errors([res.text]);
  }

  //Redirect if come from unverified email
  //FIXME: this error detection mechanism is a little weird, we should avoid compare keys.
  if (res.ok && JSON.parse(res.text).error === t('signin.error.email-not-valid')) {
    page('/signup/resend-validation-email');
  }

  if (res.body && res.body.error) {
    return this.errors([res.body.error]);
  }

  this.emit('success', res);
};

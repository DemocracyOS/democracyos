/*
 * Module dependencies.
 */

var citizen = require('citizen');
var dom = require('dom');
var FormView = require('form-view');
var template = require('./template');
var page = require('page');
var t = require('t');
var config = require('config');

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
 * Redirect to laws view
 */
SigninForm.prototype.onsuccess = function () {
  citizen.load('me');

  var sidebarItem = dom('.nav-proposal .sidebar-nav .nav.navlist li.active');
  if (sidebarItem.length) {
    var id = sidebarItem.attr('data-id');
    page('/law/' + id);
  } else {
    page('/');
  }

  citizen.once('loaded', function () {
    if (citizen.locale && citizen.locale !== config.locale) {
      window.location.reload();
    }
  });
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

  //Redirect if come from unverified email
  //FIXME: this error detection mechanism is a little weird, we should avoid compare keys.
  var text;
  try {
    text = JSON.parse(res.text);
  } catch (e) {
    text = '';
  }

  if (res.ok && text && text.error === t('signin.error.email-not-valid')) {
    page('/signup/resend-validation-email');
  }

  if (res.body && res.body.error) {
    return this.errors([t(res.body.error, { email: this.find('[name=email]').val() })]);
  }

  this.emit('success', res);
};

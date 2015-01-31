/*
 * Module dependencies.
 */

var template = require('./forgot-form');
var t = require('t');
var FormView = require('form-view');
var page = require('page');

/**
 * Expose ForgotView.
 */

module.exports = ForgotView;

/**
 * Forgot password view
 *
 * @return {ForgotView} `ForgotView` instance.
 * @api public
 */

function ForgotView() {
  if (!(this instanceof ForgotView)) {
    return new ForgotView();
  };

  FormView.call(this, template);
}

/**
 * Extend from `FormView`
 */

FormView(ForgotView);

ForgotView.prototype.switchOn = function() {
  this.on('success', this.bound('onsuccess'));
  this.on('error', this.bound('onerror'));
};

/**
 * Show success message
 */

ForgotView.prototype.onsuccess = function() {
  var form = this.find('form');
  var explanation = this.find('p.explanation-message');
  var success = this.find('p.success-message');

  form.addClass('hide');
  explanation.addClass('hide');
  success.removeClass('hide');
}

/**
 * Handle errors
 */

 ForgotView.prototype.onerror = function(error) {
    if ('notvalidated' === error.status) page('/signup/resend-validation-email');
 };
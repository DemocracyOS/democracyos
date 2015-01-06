/*
 * Module dependencies.
 */

var FormView = require('form-view');
var request = require('request');
var template = require('./reset-form');
var t = require('t');

/**
 * Expose ResetPasswordView.
 */

module.exports = ResetPasswordView;

/**
 * ResetPasswordView
 *
 * @return {ResetPasswordView} `ResetPasswordView` instance.
 * @api public
 */

function ResetPasswordView(token) {
  if (!(this instanceof ResetPasswordView)) {
    return new ResetPasswordView(token);
  };

  this.token = token;
  FormView.call(this, template, { token: token });
}

/**
 * Extend from `FormView`
 */

FormView(ResetPasswordView);

ResetPasswordView.prototype.switchOn = function() {
  this.on('success', this.bound('onsuccess'));
};

ResetPasswordView.prototype.switchOff = function() {
  this.off('success', this.bound('onsuccess'));
};

ResetPasswordView.prototype.onsuccess = function(res) {
  // // TODO cancel verify request if not finished
  // request
  // .post('/forgot/reset')
  // .send(data)
  // .end(function(err, res) {
    // if (!res.ok) {
    //    return this.errors([res.error]);
    // };
    // if (err || (res.body && res.body.error)) {
    //   return this.errors([err || res.body.error]);
    // };
    window.location.replace('/');
  // });
};

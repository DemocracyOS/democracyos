/*
 * Module dependencies.
 */

var citizen = require('citizen');
var dom = require('dom');
var FormView = require('form-view');
var template = require('./template');
var page = require('page');

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
  };

  FormView.call(this, template);
}

/**
 * Inherit from `FormView`
 */

FormView(SigninForm);

SigninForm.prototype.switchOn = function() {
  this.on('success', this.bound('onsuccess'));
};

SigninForm.prototype.switchOff = function() {
  this.off('success', this.bound('onsuccess'));
};

/**
 * Show success message
 */

SigninForm.prototype.onsuccess = function() {
  citizen.load('me');
  var sidebarItem = dom('.nav-proposal .sidebar-nav .nav.navlist li.active');
  if (sidebarItem.length()) {
    var id = sidebarItem.attr('data-id');
    page('/law/' + id);
  } else {
    page('/');
  }
}

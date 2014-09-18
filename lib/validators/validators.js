/**
 * Module dependencies.
 */

var assert = require('assert');
var o = require('dom');
var regexps = require('regexps');
var t = require('t');

exports.required = function(val, option, fn) {
  fn('' == val.trim() ? t('validators.required') : null);
};

exports.checked = function(val, option, fn) {
  fn("" == val ? t('validators.checked') : null);
};

exports.any = function(val, option, fn) {
  var els = o('input[name="' + option + '"]:checked');
  fn(0 === els.length ? t('validators.checked') : null);
}

exports.email = function(val, option, fn) {
  val = val.trim();
  fn(!regexps.email.test(val) && '' != val ? t('validators.invalid.email') : null);
};

exports.firstname = function(val, option, fn) {
  val = val.trim();
  fn(!regexps.names.test(val) && '' != val ? t('validators.invalid.firstname') : null);
};

exports.lastname = function(val, option, fn) {
  val = val.trim();
  fn(!regexps.names.test(val) && '' != val ? t('validators.invalid.lastname') : null);
};

exports.author = function(val, option, fn) {
  val = val ? val.trim() : '';
  fn(!regexps.names.test(val) && '' != val ? t('validators.invalid.author') : null);
};

exports.url = function(val, option, fn) {
  fn(!regexps.url.test(val) && '' != val.trim() ? t('validators.invalid.url') : null);
};

exports.numeric = function(val, option, fn) {
  fn(!regexps.numeric.test(val) && '' != val.trim() ? t('validators.invalid.number') : null);
};

exports.password = function(val, option, fn) {
  fn(!regexps.password.test(val) && '' != val.trim() ? t('invalid.password') : null);
};

exports['min-length'] = function(val, n, fn) {
  var options = {n: n};
  var msg = n > 1 ? t('validators.min-length.plural', options) : t('validators.min-length.singular', options);
  msg = val.length < n ? msg : null;
  fn(msg);
};

exports.same = function(val, option, fn) {
  var el = o('input[name="' + option + '"]');
  assert(el.length, t('validators.input.not-exists', { name: option }));
  var key = 'validators.' + option + '.not.match';
  var msg = val !== el.val() ? t(key) : null;
  fn(msg);
};

exports.equals = function(val, option, fn) {
  var msg = option === val ? null : t('validators.invalid');
  fn(msg);
};

exports.notEquals = function(val, option, fn) {
  var msg = option !== val ? null : t('validators.invalid');
  fn(msg);
};

exports.time = function(val, option, fn) {
  fn('' != val.trim() && !regexps.time.test(val) ? t('validators.invalid.time') : null);
};

function name(str) {
  return str.replace(/_/g, " ");
}
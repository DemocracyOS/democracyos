import assert from 'assert';
import o from 'component-dom';
import t from 't-component';
import regexps from '../regexps';

export function requred(val, option, fn) {
  val = val || '';
  fn('' == val.trim() ? t('validators.required') : null);
}

export function checked(val, option, fn) {
  fn("" == val ? t('validators.checked') : null);
}

export function any(val, option, fn) {
  var els = o('input[name="' + option + '"]:checked');
  fn(0 === els.length ? t('validators.checked') : null);
}

export function email(val, option, fn) {
  val = val.trim();
  fn(!regexps.email.test(val) && '' != val ? t('validators.invalid.email') : null);
}

export function emails(val, option, fn) {
  val = val.trim();
  fn(!regexps.emails.test(val) && '' != val ? t('validators.invalid.email') : null);
}

export function firstname(val, option, fn) {
  val = val.trim();
  fn(!regexps.names.test(val) && '' != val ? t('validators.invalid.firstname') : null);
}

export function lastname(val, option, fn) {
  val = val.trim();
  fn(!regexps.names.test(val) && '' != val ? t('validators.invalid.lastname') : null);
}

export function author(val, option, fn) {
  val = val ? val.trim() : '';
  fn(!regexps.names.test(val) && '' != val ? t('validators.invalid.author') : null);
}

export function url(val, option, fn) {
  fn(!regexps.url.test(val) && '' != val.trim() ? t('validators.invalid.url') : null);
}

export function numeric(val, option, fn) {
  fn(!regexps.numeric.test(val) && '' != val.trim() ? t('validators.invalid.number') : null);
}

export function password(val, option, fn) {
  fn(!regexps.password.test(val) && '' != val.trim() ? t('invalid.password') : null);
}

exports['min-length'] = function(val, n, fn) {
  var options = {n: n};
  var msg = n > 1 ? t('validators.min-length.plural', options) : t('validators.min-length.singular', options);
  msg = val.length < n ? msg : null;
  fn(msg);
};

exports['max-length'] = function(val, n, fn) {
  var options = {n: n};
  var msg = n > 1 ? t('validators.max-length.plural', options) : t('validators.max-length.singular', options);
  msg = val.length > n ? msg : null;
  fn(msg);
};

export function same(val, option, fn) {
  var el = o('input[name="' + option + '"]');
  assert.ok(el.length, t('validators.input.not-exists', { name: option }));
  var key = 'validators.' + option + '.not.match';
  var msg = val !== el.val() ? t(key) : null;
  fn(msg);
}

export function equals(val, option, fn) {
  var msg = option === val ? null : t('validators.invalid');
  fn(msg);
}

export function notEquals(val, option, fn) {
  var msg = option !== val ? null : t('validators.invalid');
  fn(msg);
}

export function time(val, option, fn) {
  fn('' != val.trim() && !regexps.time.test(val) ? t('validators.invalid.time') : null);
}

let name = str => str.replace(/_/g, " ");

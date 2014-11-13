/**
 * Module dependencies.
 */

var o = require('dom');
var validators = require('validators');
var log = require('debug')('democracyos:validate');

exports = module.exports = validate;

/**
 * Validate certain fields
 */

function validate(fields, print, fn) {
  fn = 'function' == typeof fn ? fn : print;
  print = 'boolean' == typeof print ? print : true;
  exports.clearAll();
  var isvalid = true;
  var pending = Object.keys(fields).length;
  if (!pending)
    return fn(isvalid);
  for (var field in fields) {
    var el = o('[name="' + field + '"]');
    var chk = 'checkbox' == el.attr('type');
    var val = chk ? el.prop('checked') ? true : false : el.val();
    exports.field(field, fields[field], val, print, function(ok) {
      isvalid = isvalid && ok;
      --pending || fn(isvalid);
    })
  }
}

/**
 * Clear all fields from error messages
 */

exports.clearAll = function() {
  log('clear fields, notes, messages');
  o('form span.error').remove();
  o('.note').remove();
  o('input.error, select.error').removeClass('error');
};

/**
 * Append a note to a particular field
 */

exports.note = function(field, str) {
  var note = o('<p class="note">' + str + '</p>');
  o('input[name="' + field + '"]')[0].parent('p').append(note);
};

/**
 * Disable a button given a `selector`
 */

exports.disable = function(selector) {
  if ('string' == typeof selector) {
    selector = o(selector);
  }
  o('button', selector).attr('disabled', true);
};

/**
 * Enable a button given a `selector`
 */

exports.enable = function(selector) {
  o('button', selector).attr('disabled', null);
};

/**
 * Remove certain field error elements
 */

exports.clear = function(field) {
  log('clear `%s` field', field);
  o('input[name="' + field + '"]').removeClass('error');
  o('input[name="' + field + '"] ~ span.error').remove();
  o('input[name="' + field + '"] ~ .note').remove();
};

/**
 * Append error element to a given field
 */

exports.error = function(field, msg) {
  var el = o('[name="' + field + '"]');
  var err = o('<span class="error">').text(msg);
  el.addClass('error');
  err.insertAfter(el);
  el.on('input', function() {
    exports.clear(field);
    el.off('input');
  })
};

/**
 * Validate certain field
 */

exports.field = function(name, options, val, print, fn) {
  log('validate `%s` - %s', name, val, options);
  var pending = Object.keys(options).length;
  var hasError = false;
  var ok = true;

  for (var key in options) {
    var cb = validators[key];
    if (!cb)
      throw new Error('invalid validator "' + key + '"');
    cb(val, options[key], function(err) {
      if (err && !hasError) {
        if (print)
          exports.error(name, err);
        hasError = true;
        ok = false;
      }
      --pending || function() {
        log('validation for `%s`: %s', name, ok);
        return fn(ok);
      }();
    });
  }
}
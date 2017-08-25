/**
 * Module dependencies.
 */

import o from 'component-dom'
import debug from 'debug'
import validators from '../../validators/validators'

let log = debug('democracyos:validate')

/**
 * Validate certain fields
 */

export default function validate (fields, ctx, print, fn) {
  fn = typeof fn === 'function' ? fn : print
  print = typeof print === 'boolean' ? print : true
  clearAll()
  var isvalid = true
  var pending = Object.keys(fields).length
  if (!pending) return fn(isvalid)
  for (var field in fields) {
    var el = o('[name="' + field + '"]', ctx)
    var chk = el.attr('type') === 'checkbox'
    var val = chk ? el.prop('checked') : el.val()
    exports.field(field, fields[field], val, ctx, print, function (ok) {
      isvalid = isvalid && ok
      --pending || fn(isvalid)
    })
  }
}

/**
 * Clear all fields from error messages
 */

export function clearAll () {
  log('clear fields, notes, messages')
  o('form span.error').remove()
  o('.note').remove()
  o('input.error, select.error').removeClass('error')
}

/**
 * Append a note to a particular field
 */

export function note (field, str) {
  var note = o('<p class="note">' + str + '</p>')
  o('input[name="' + field + '"]')[0].parent('p').append(note)
}

/**
 * Disable a button given a `selector`
 */

export function disable (selector) {
  if (typeof selector === 'string') {
    selector = o(selector)
  }
  o('button', selector).attr('disabled', true)
}

/**
 * Enable a button given a `selector`
 */

export function enable (selector) {
  o('button', selector).attr('disabled', null)
}

/**
 * Remove certain field error elements
 */

export function clear (field) {
  log('clear `%s` field', field)
  o('input[name="' + field + '"]').removeClass('error')
  o('input[name="' + field + '"] ~ span.error').remove()
  o('input[name="' + field + '"] ~ .note').remove()
}

/**
 * Append error element to a given field
 */

export function error (field, ctx, msg) {
  var el = o('[name="' + field + '"]', ctx)
  var err = o('<span class="error">').text(msg)
  el.addClass('error')
  err.insertAfter(el)
  el.on('input', () => {
    exports.clear(field)
    el.off('input')
  })
}

/**
 * Validate certain field
 */

export function field (name, options, val, ctx, print, fn) {
  log('validate `%s` - %s', name, val, options)
  var pending = Object.keys(options).length
  var hasError = false
  var ok = true

  for (var key in options) {
    var cb = validators[key]
    if (!cb) throw new Error('invalid validator "' + key + '"')
    cb(val, options[key], (err) => {
      if (err && !hasError) {
        if (print) error(name, ctx, err)
        hasError = true
        ok = false
      }
      --pending || (function () {
        log('validation for `%s`: %s', name, ok)
        return fn(ok)
      }())
    })
  }
}

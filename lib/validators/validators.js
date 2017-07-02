import assert from 'assert'
import o from 'component-dom'
import t from 't-component'
import validUrl from 'valid-url'
import regexps from '../regexps'

export default {
  required: (val, option, fn) => {
    val = val || ''
    fn(val.trim() === '' ? t('validators.required') : null)
  },

  checked: (val, option, fn) => {
    fn(val === '' ? t('validators.checked') : null)
  },

  any: (val, option, fn) => {
    var els = o('input[name="' + option + '"]:checked')
    fn(els.length === 0 ? t('validators.checked') : null)
  },

  email: (val, option, fn) => {
    val = val.trim()
    fn(!regexps.email.test(val) && val !== '' ? t('validators.invalid.email') : null)
  },

  emails: (val, option, fn) => {
    val = val.split(',').map((e) => e.trim().toLowerCase()).join(',')
    fn(!regexps.emails.test(val) && val !== '' ? t('validators.invalid.email') : null)
  },

  firstname: (val, option, fn) => {
    val = val.trim()
    fn(!regexps.names.test(val) && val !== '' ? t('validators.invalid.firstname') : null)
  },

  lastname: (val, option, fn) => {
    val = val.trim()
    fn(!regexps.names.test(val) && val !== '' ? t('validators.invalid.lastname') : null)
  },

  author: (val, option, fn) => {
    val = val ? val.trim() : ''
    fn(!regexps.names.test(val) && val !== '' ? t('validators.invalid.author') : null)
  },

  url: (val, option, fn) => {
    val = encodeURI(val)
    fn(!validUrl.isUri(val) && val.trim() !== '' ? t('validators.invalid.url') : null)
  },

  numeric: (val, option, fn) => {
    fn(!regexps.numeric.test(val) && val.trim() !== '' ? t('validators.invalid.number') : null)
  },

  password: (val, option, fn) => {
    fn(!regexps.password.test(val) && val.trim() !== '' ? t('invalid.password') : null)
  },

  'min-length': (val, n, fn) => {
    var options = { n: n }
    var msg = n > 1 ? t('validators.min-length.plural', options) : t('validators.min-length.singular', options)
    msg = val.length < n ? msg : null
    fn(msg)
  },

  'max-length': (val, n, fn) => {
    var options = { n: n }
    var msg = n > 1 ? t('validators.max-length.plural', options) : t('validators.max-length.singular', options)
    msg = val.length > n ? msg : null
    fn(msg)
  },

  same: (val, option, fn) => {
    var el = o('input[name="' + option + '"]')
    assert.ok(el.length, t('validators.input.not-exists', { name: option }))
    var key = 'validators.' + option + '.not.match'
    var msg = val !== el.val() ? t(key) : null
    fn(msg)
  },

  equals: (val, option, fn) => {
    var msg = option === val ? null : t('validators.invalid')
    fn(msg)
  },

  notEquals: (val, option, fn) => {
    var msg = option !== val ? null : t('validators.invalid')
    fn(msg)
  },

  time: (val, option, fn) => {
    fn(val.trim() !== '' && !regexps.time.test(val) ? t('validators.invalid.time') : null)
  },

  forum: (val, option, fn) => {
    fn(val.trim() !== '' && !regexps.forum.name.test(val) ? t('validators.invalid.forum') : null)
  }

}

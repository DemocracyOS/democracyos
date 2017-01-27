import o from 'component-dom'
import debug from 'debug'
import serialize from 'get-form-data'
import validate from '../validate/validate'

let log = debug('democracyos:autovalidate')

export default function autovalidate (el, fn) {
  var form = o(el)
  var options = {}
  form.find('input, textarea, select').each((node) => {
    var vals = exports.validators(o(node))
    if (!vals) return
    options[vals.name] = vals.validations
  })

  validate(options, form[0], (ok) => {
    if (!ok) return log('validation failed')
    var obj = serialize(form[0])
    log('fn(%j)', obj)
    fn(obj)
  })
}

export function validators (field) {
  var validations = field.attr('validate')
  if (!validations) return
  var name = field.attr('name')
  validations = validations.split(' ').reduce(values, {})
  log('validators for `%s`', name, validations)
  return { name: name, validations: validations }
}

function values (obj, name) {
  var parts = name.split(':')
  obj[parts[0]] = parts[1] == null ? true : parts[1]
  return obj
}

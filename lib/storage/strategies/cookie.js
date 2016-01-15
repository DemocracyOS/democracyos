import _cookie from 'component-cookie'

var serialize = (val) => typeof val === 'string' ? val : JSON.stringify(val)
var unserialize = (obj) => JSON.parse(obj)

/**
 * Expose
 */

var cookie = {}

/**
 * Define
 */

cookie.supported = () => true

cookie.get = (key, fn) => {
  var val = unserialize(_cookie(key))
  if (fn) fn(null, val)
  return val
}

cookie.set = (key, value, fn) => {
  _cookie(key, serialize(value), { path: '/' })
  if (fn) fn(null, value)
  return this
}

cookie.remove = (key, fn) => {
  var val = _cookie(key, null)
  if (fn) fn(null, val)
  return this
}

export default cookie

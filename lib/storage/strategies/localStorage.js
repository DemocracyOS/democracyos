/**
 * Module dependencies.
 */

import store from 'store'

/**
 * Initialize
 */

let localStorage = {}

/**
 * Define
 */

localStorage.supported = () => store.enabled

localStorage.get = (key, fn) => {
  var val = store.get(key)
  if (fn) fn(null, val)
  return val
}

localStorage.set = (key, value, fn) => {
  var val = store.set(key, value)
  if (fn) fn(null, val)
  return this
}

localStorage.remove = (key, fn) => {
  var val = store.remove(key)
  if (fn) fn(null, val)
  return this
}

/**
 * Expose
 */

export default localStorage

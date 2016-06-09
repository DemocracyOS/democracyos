/**
 * Module dependencies.
 */

import debug from 'debug'

/**
 * Initialize debug
 */

const key = window.localStorage.debug

if (key === '*') {
  debug.enable('democracyos:*')
} else if (key) {
  debug.enable(key)
}

export default debug

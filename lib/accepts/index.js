/**
 * Module dependencies.
 */

const log = require('debug')('democracyos:accepts')
const type = require('type-component')

/**
 * Expose accepts middelware constructor
 */

module.exports = accepts

/**
 * Allow only provided formats, and optionally
 *
 * @param {String|Array} formats allowed for middleware
 * @param {Function} reject middleware for rejected cases
 * @return {Function} [description]
 */

function accepts (formats, reject) {
  if (type(formats) === 'string') formats = formats.split(/\s+/)
  return function middleware (req, res, next) {
    if (lookup(formats, req.accepts())) return next()
    if (reject) {
      log('Rejecting request with reject middleware')
      return reject(req, res, next)
    }
    log('Rejecting request')
    res.send(406)
  }
}

/**
 * Lookups for at least once accepted format in types
 * and returns `true`. Returns `false` if not found
 *
 * @param {Array} formats
 * @param {Array} types
 * @return {Boolean} found format in types
 */

function lookup (formats, types) {
  for (var i = 0; i < formats.length; i++) {
    const format = formats[i].replace('*', '')
    if (!format) continue

    for (var j = 0; j < types.length; j++) {
      if (!types[j].indexOf(format)) return true
    }
  }

  return false
}

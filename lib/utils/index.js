/**
 * Module dependencies.
 */

var crypto = require('crypto')
var url = require('url')
var marked = require('marked')
var mongoose = require('mongoose')
var log = require('debug')('democracyos:utils')
var config = require('lib/config')

var has = Object.prototype.hasOwnProperty

/**
 * Check required params for request.
 *
 * Examples:
 *
 *     app.get('/my/route', required('uid username'), function (req, res) {
 *       // All params in `req.param()`
 *     })
 *
 *     req.get('Something', required('uid name', 'body'), function (req, res) {
 *       // All params in `req.body`
 *     })
 *
 * @param {String} params to check in request
 * @param {String} context from where to check params. [params|query|body]
 * @return {Function} middleware fallback
 * @api public
 */

exports.required = function required (params, context) {
  params = params.split(' ')

  return function (req, res, next) {
    var extract = context
      ? function (param) { return req[context][param] }
      : req.param

    var missed = []
    params.forEach(function (param) {
      if (!extract(param)) {
        missed.push(param)
      }
    })

    if (missed.length) {
      var message = req.path.concat('::')
        .concat('Missing params in request: ')
        .concat(missed.join(', '))
      log(message)
      return res.status(200).json({
        error: message
      })
    }

    next()
  }
}

/**
 * Basic access restriction middleware
 * for authenticated users.
 */

exports.restrict = function restrict (req, res, next) {
  log('Checking for logged in user')

  if (req.user) {
    log('User logged in, moving on...')
    next()
  } else {
    log('User is not logged in. Path %s is restricted.', req.path)
    // we should actually redirect
    // to a login page...
    res.format({
      html: function () {
        // TODO: update this with new credential system
        res.send(403)
      },
      json: function () {
        res.status(403).json({
          error: 'Forbidden access',
          action: {
            redirect: '/signin'
          }
        })
      }
    })
  }
}

/**
 * Basic staff restriction middleware blocking
 * non-staff users to access some resources
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @api public
 */

exports.staff = function staff (req, res, next) {
  if (!req.user) {
    log('User not logged in')
    return res.send(403)
  }
  if (!req.user.staff) {
    log('User is not from staff')
    return res.send(403)
  }
  next()
}

/**
 * View helper for markdown convertion
 * to html via Jade.
 */

exports.md = function md (source, options) {
  options = options || {}
  options.sanitize = options.sanitize || true

  // github like mardown for tabs and newlines
  source = source
    // \r\n and \r -> \n
    .replace(/\r\n?/g, '\n')

    // 2 newline to paragraph
    .replace(/\n\n+/, '\n\n')

    // 1 newline to br
    .replace(/([^\n]\n)(?=[^\n])/g, function (m) {
      return /\n{2}/.test(m) ? m : m.replace(/\s+$/, '') + '  \n'
    })

    // tabs to four spaces
    .replace(/\t/g, '    ')

  return marked(source, options)
}

/**
 * HOP ref.
 */

exports.has = has

/**
 * MD5 hash generator.
 *
 * @param {String} string String to encrypt.
 * @return {String} MD5 encrypted string.
 * @api public
 */

exports.md5 = function md5 (string) {
  return crypto.createHash('md5').update(string).digest('hex')
}

/**
 * Map array of objects by `property`
 *
 * @param {Array} source array of objects to map
 * @param {String} property to map from objects
 * @return {Array} array of listed properties
 * @api private
 */

exports.pluck = function pluck (source, property) {
  return source.map(function (item) { return item[property] })
}

/**
 * Applies a mapping method for user's
 * considering some keys for an object item
 *
 * @param {String} keys
 * @return {Function} map function for `Array.prototype.map`
 * @api public
 */

exports.expose = function expose (keys) {
  if (typeof keys === 'string') keys = keys.split(' ')

  return function (item) {
    var ret = {}

    keys.forEach(function (key) {
      var segments = exports.sanitize(key).split('.')
      var cursor = ret
      segments.forEach(function (s, i) {
        if (segments.length - 1 > i) cursor = cursor[s] = cursor[s] || {}
        else cursor[s] = exports.get(key, item)
      })
    })

    return ret
  }
}

/**
 * Get Object's path value
 *
 * @param {String} path
 * @param {Object} obj
 * @return {Mixed}
 * @api public
 */

function index (obj, i) {
  if (!obj) return undefined
  return obj[i]
}

exports.get = function get (path, obj) {
  return path.split('.').reduce(index, obj)
}

/**
 * sanitizes some `key`'s name for propper
 * object definition
 *
 * @param {String} key
 * @return {String} sanitized key
 * @api public
 */

exports.sanitize = function sanitize (key) {
  var methods = /\(.*\)/g
  var chars = /[^a-zA-Z_.]/g
  return key.replace(methods, '').replace(chars, '')
}

/**
 * Convenience for building a proper URL for application callbacks.
 * Based on `url.format`, but considers SSL settings and some defaults.
 * Included defaults are:
 *   `protocol` - Defaults to `config.protocol`
 *   `hostname` - Defaults to `config.host`
 *   `port` - Defaults to `config.publicPort` or `config.https.port`, depending if SSL is enabled.
 * @param  {[type]} config  `lib/config` object. For some reason can't require from `utils`.
 * @param  {[type]} options URL building options. Same as for `url.format`
 * @return {[type]}         A fully formated URL (what `url.format` would return)
 */
exports.buildUrl = function buildUrl (config, options) {
  options = options || {}
  options.protocol = (options.protocol || config.protocol).toLowerCase()
  options.hostname = options.hostname || config.host
  options.port = parseInt(options.port || inferPort(config, options))

  if (isDefaultPort(options.protocol, options.port)) delete options.port

  return url.format(options)
}

function inferPort (config, options) {
  return options.protocol === 'https' ? config.https.port : config.publicPort
}

function isDefaultPort (protocol, port) {
  if (protocol === 'http' && port === 80) return true
  if (protocol === 'https' && port === 443) return true
  return false
}

/**
 * Maintenance checking
 */

exports.maintenance = function maintenance (req, res, next) {
  log('Checking if maintenance mode: on')

  if (config.maintenance) {
    res.sendStatus(503)
  } else {
    next()
  }
}

exports._handleError = function _handleError (err, req, res) {
  log('Error found: %s', err)
  var error = err
  if (err.errors && err.errors.text) error = err.errors.text
  if (error.type) error = error.type

  res.status(400).json({ error: error })
}

exports.getIdString = function getIdString (id) {
  if (!id) {
    throw new Error('Invalid id value')
  }

  if (typeof id === 'string') {
    if (exports.isValidMongoIdString(id)) {
      return id
    } else {
      throw new Error('Invalid id value')
    }
  }

  if (id.constructor === mongoose.Types.ObjectId) {
    return id.toString()
  }

  if (typeof id === 'object' && id._id) {
    return exports.getIdString(id._id)
  }

  if (typeof id === 'object' && id.id) {
    return exports.getIdString(id.id)
  }

  throw new Error('Invalid id value')
}

const mongoIdValidRegexp = /^[0-9a-fA-F]{24}$/

exports.isValidMongoIdString = function isValidMongoIdString (str) {
  return mongoIdValidRegexp.test(str)
}

exports.getQueryVariable = function getQueryVariable (variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false)
}

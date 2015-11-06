/**
 * Module dependencies.
 */

var marked = require('marked');
var has = Object.prototype.hasOwnProperty;
var crypto = require('crypto');
var url = require('url');
var tr = require('transliteration').slugify;
var config = require('lib/config');
var log = require('debug')('democracyos:utils');

/**
 * Check required params for request.
 *
 * Examples:
 *
 *     app.get('/my/route', required('uid username'), function (req, res) {
 *       // All params in `req.param()`
 *     });
 *
 *     req.get('Something', required('uid name', 'body'), function (req, res) {
 *       // All params in `req.body`
 *     });
 *
 * @param {String} params to check in request
 * @param {String} context from where to check params. [params|query|body]
 * @return {Function} middleware fallback
 * @api public
 */

exports.required = function required(params, context) {
  params = params.split(' ');

  return function (req, res, next) {
    var extract = context
      ? function(param) { return req[context][param] }
      : req.param;

    var missed = [];
    params.forEach(function(param) {
      if (!extract(param)) {
        missed.push(param);
      }
    });

    if (missed.length) {
      var message = req.path.concat('::')
        .concat('Missing params in request: ')
        .concat(missed.join(', '));
      log(message);
      return res.json({
        error: message
      });
    }

    next();
  }
}


/**
 * Basic access restriction middleware
 * for authenticated users.
 */

exports.restrict = function restrict(req, res, next) {
  log('Checking for logged in user');

  if (req.user) {
    log('User logged in, moving on...')
    next();
  } else {
    log('User is not logged in. Path %s is restricted.', req.path);
    // we should actually redirect
    // to a login page...
    res.format({
      html: function () {
        //TODO: update this with new credential system
        res.send(403);
      },
      json: function() {
        res.json(403, {
          error: 'Forbidden access',
          action: {
            redirect: '/signin'
          }
        })
      }
    });
  }
};

/**
 * Basic staff restriction middleware blocking
 * non-staff users to access some resources
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @api public
 */

exports.staff = function staff(req, res, next) {
  if (!req.user) return log('User not logged in'), res.send(403);
  if (!req.user.staff) return log('User is not from staff'), res.send(403);
  next();
}

/**
 * View helper for markdown convertion
 * to html via Jade.
 */

exports.md = function md(source, options) {
  options = options || {};
  options.sanitize = options.sanitize || true;

  // github like mardown for tabs and newlines
  source = source
  // \r\n and \r -> \n
  .replace(/\r\n?/g, '\n')

  // 2 newline to paragraph
  .replace(/\n\n+/, '\n\n')

  // 1 newline to br
  .replace(/([^\n]\n)(?=[^\n])/g, function(m) {
    return /\n{2}/.test(m) ? m : m.replace(/\s+$/,'') + '  \n';
  })

  // tabs to four spaces
  .replace(/\t/g, '    ');

  return marked(source, options);
};

/**
 * HOP ref.
 */

exports.has = has;

/**
 * MD5 hash generator.
 *
 * @param {String} string String to encrypt.
 * @return {String} MD5 encrypted string.
 * @api public
 */

exports.md5 = function md5(string) {
  return crypto.createHash('md5').update(string).digest('hex');
}

/**
 * Map array of objects by `property`
 *
 * @param {Array} source array of objects to map
 * @param {String} property to map from objects
 * @return {Array} array of listed properties
 * @api private
 */

exports.pluck = function pluck(source, property) {
  return source.map(function(item) { return item[property]; });
};

/**
 * Applies a mapping method for user's
 * considering some keys for an object item
 *
 * @param {String} keys
 * @return {Function} map function for `Array.prototype.map`
 * @api public
 */

exports.expose = function expose(keys) {
  keys = keys.split(' ');

  return function(item) {
    var ret = {};

    keys.forEach(function(key) {
      var segments = exports.sanitize(key).split('.');
      var cursor = ret;
      segments.forEach(function(s, i) {
        if (segments.length - 1 > i) cursor = cursor[s] = cursor[s] || {};
        else cursor[s] = exports.get(key, item);
      });
    });

    return ret;
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

function index(obj,i) {
  return obj[i]
}

exports.get = function get(path, obj) {
  return path.split('.').reduce(index, obj);
}

/**
 * sanitizes some `key`'s name for propper
 * object definition
 *
 * @param {String} key
 * @return {String} sanitized key
 * @api public
 */

exports.sanitize = function sanitize(key) {
  var methods = /\(.*\)/g;
  var chars = /[^a-zA-Z_\.]/g;
  return key.replace(methods, '').replace(chars, '');
}

/**
 * Normalizes a given string.
 * E.g.: 'This Cool String' would result 'this-cool-string'
 * @param  {String} value String to be normalized
 * @return {String}      Normalized string
 */
exports.normalize = function normalize(value) {
  return tr(value).trim()
    .toLowerCase()
    .replace(/\s+/g,'-')
    .replace(/[àáâãäå]/g,'a')
    .replace(/æ/g,'ae')
    .replace(/ç/g,'c')
    .replace(/[èéêë]/g,'e')
    .replace(/[ìíîï]/g,'i')
    .replace(/ñ/g,'n')
    .replace(/[òóôõö]/g,'o')
    .replace(/œ/g,'oe')
    .replace(/[ùúûü]/g,'u')
    .replace(/[ýÿ]/g,'y')
    .replace(/-+/g,'_')
    .replace(/\W/g,'')
    .replace(/_+/g,'-')
    .replace(/^-/,'')
    .replace(/-$/,'')
    .substring(0,139); //No longer than a tweet ;)
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
exports.buildUrl = function buildUrl(config, options) {
  options = options || {};
  options.protocol = (options.protocol || config.protocol).toLowerCase();
  options.hostname = options.hostname || config.host;
  options.port = parseInt(options.port || inferPort(config, options));

  if (isDefaultPort(options.protocol, options.port)) delete options.port;

  return url.format(options);
};

function inferPort(config, options) {
  return 'https' == options.protocol ? config.https.port : config.publicPort;
}

function isDefaultPort(protocol, port) {
  if ('http' === protocol && 80 === port) return true;
  if ('https' === protocol && 443 == port) return true;
  return false;
}

/**
 * Maintenance checking
 */

exports.maintenance = function maintenance(req, res, next) {
  log('Checking if maintenance mode: on');

  if (config.maintenance) {
    res.sendStatus(503);
  } else {
    next();
  }
};

exports._handleError = function _handleError (err, req, res) {
  log("Error found: %s", err);
  var error = err;
  if (err.errors && err.errors.text) error = err.errors.text;
  if (error.type) error = error.type;

  res.json(400, { error: error });
}

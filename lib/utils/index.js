/**
 * Module dependencies.
 */

var marked = require('marked')
  , has = Object.prototype.hasOwnProperty
  , crypto = require('crypto')
  , type = require('type-component')
  , log = require('debug')('democracyos:utils');

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
      };
    });

    if (missed.length) {
      var message = req.path.concat('::')
        .concat("Missing params in request: ")
        .concat(missed.join(', '));
      log(message);
      return res.json({
        error: message
      });
    };

    next();
  }
}


/**
 * Basic access restriction middleware
 * for authenticated users.
 */

exports.restrict = function restrict(req, res, next) {
  log('Checking for logged in citizen');
  if(req.isAuthenticated()) {
    log('Citizen logged in, moving on...')
    next();
  } else {
    log('Citizen is not logged in. Path %s is restricted.', req.path);
    // we should actually redirect
    // to a login page...
    res.format({
      html: function () {
        //TODO: update this with new credential system
        res.redirect('/auth/facebook');
      },
      json: function() {
        res.json(403, {
          error: 'Forbidden access',
          action: {
            redirect: '/auth/facebook'
          }
        })
      }
    });
  }
};

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
  .replace(/\n\n+/, "\n\n")

  // 1 newline to br
  .replace(/([^\n]\n)(?=[^\n])/g, function(m) {
    return /\n{2}/.test(m) ? m : m.replace(/\s+$/,"") + "  \n";
  })

  // tabs to four spaces
  .replace(/\t/g, '    ');

  return marked(source, options);
};

/**
 * Merge `b` into `a`.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api public
 */

exports.merge = function merge (a, b){
  for (var key in b) {
    if (has.call(b, key) && b[key] != null) {
      if (!a) a = {};
      if ('object' === type(b[key])) {
        a[key] = exports.merge(a[key], b[key]);
      } else {
        a[key] = b[key];
      }
    }
  }
  return a;
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
  return crypto.createHash('md5').update(string).digest("hex");
}
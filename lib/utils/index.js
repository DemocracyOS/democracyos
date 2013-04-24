/**
 * Module dependencies.
 */

var marked = require('marked')
  , basic = require('http-auth')({
      authRealm : "Private area."
    , authList : ['pepe:tortugasninja']
  })
  , has = Object.prototype.hasOwnProperty
  , crypto = require('crypto');

/**
 * Basic access restriction middleware
 * for authenticated users.
 */

exports.restrict = function restrict(req, res, next){
  if(req.isAuthenticated()) next();
  else res.redirect('/');
};

/**
 * Basic HTTP-Auth restriction middleware
 * for production access only.
 */

exports.httpAuth = function httpAuth(app) {
  return function(req, res, next) {
    basic.apply(req, res, function(username, b, c, d) {
      return next();
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
 * Merge object `b` into `a`.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api public
 */

exports.merge = function merge(a, b) {
  for (var key in b) {
    if (has.call(b, key)) {
      a[key] = b[key];
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
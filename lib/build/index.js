/**
 * Module dependencies.
 */

var Builder = require('component-builder')
  , json = require('./json')
  , templates = require('./templates')
  , fs = require('fs')
  , write = fs.writeFileSync
  , log = require('debug')('democracyos:build')
  ;

/**
 * Expose component
 * builder getter
 */

module.exports.createBuilder = createBuilder;

/**
 * Expose component
 * build middleware.
 */

module.exports.middleware = middleware;

/**
 * Creates a `Builder` instance
 * ready for build
 */

function createBuilder () {
  var builder = new Builder('.');
  builder.copyFiles();
  builder.addLookup('lib'); // TODO: shouldn't be necessary
  builder.copyAssetsTo('public');
  // builder.use(json);
  builder.use(templates);

  return builder;
}

/**
 * Express build middleware
 */

function middleware (req, res, next) {
  // Build on application request paths only
  if (!~['/app.js', '/app.css'].indexOf(req.path)) {
    return next();
  };

  log('Attempting to build for %s request path.', req.path);

  var builder = createBuilder();
  builder.build(function(err, res){
    if (err) return next(err);
    log('Writing recent build for %s request path.', req.path);

    write('public/app.js', res.require + res.js);
    write('public/app.css', res.css);

    log('Leaving middleware after write for path %s', req.path);
    next();
  });
};

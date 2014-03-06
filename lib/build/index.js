/**
 * Module dependencies.
 */

var Builder = require('component-builder');
var jade = require('./jade');
var styl = require('./styl');
var fs = require('fs');
var write = fs.writeFileSync;
var log = require('debug')('democracyos:build');

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
  builder.use(jade);
  builder.use(styl);

  return builder;
}

/**
 * Express build middleware
 */

function middleware (req, res, next) {
  // Build only script and stylesheet
  if (!/app\.(js|css)/.test(req.path)) {
    return next();
  };

  log('Build %s.', req.path);

  var builder = createBuilder();
  builder.build(function(err, res){
    if (err) return next(err);

    log('Write script and stylesheet');
    write('public/app.js', res.require + res.js);
    write('public/app.css', res.css);
    next();
  });
};

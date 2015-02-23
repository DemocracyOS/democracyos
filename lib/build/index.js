/**
 * Module dependencies.
 */

var builder = require('component-builder');
var jade = require('builder-jade');
var stylus = require('./stylus');
var fs = require('fs');
var write = fs.writeFileSync;
var log = require('debug')('democracyos:build');
var resolve = require('component-resolver');
var jade = require('builder-jade');
var Batch = require('batch');

/**
 * Expose component
 * builder getter
 */

module.exports.build = build;

/**
 * Expose component
 * build middleware.
 */

module.exports.middleware = middleware;

/**
 * Creates a `build` instance
 * ready for build
 */

function build(done) {
  log('Start assets compilation')

  var options = {
    install: false,
    root: 'public'
  };

  resolve(process.cwd(), options, onresolve);

  function onresolve(err, tree) {
    if (err) return log('Found error resolving dependencies tree %s', err), done(err);

    var batch = new Batch();
    batch.push(buildScripts);
    batch.push(buildStyles);
    batch.push(buildFiles);

    batch.end(function (err, results) {
      if (err) return log('Found error compiling assets: %s', err), done(err);

      log('Done compiling assets');
      var res = {};
      res.js = results[0];
      res.css = results[1];
      done(null, res);
    });

    function buildScripts(done) {
      builder.scripts(tree)
        .use('scripts', builder.plugins.js())
        .use('json', builder.plugins.json())
        .use('templates', jade({
          string: false,
          runtime: true
        }))
        .use('templates', builder.plugins.string())
        .end(function (err, js) {
          if (err) return log('Found error building scripts'), done(err);

          return log('Scripts built successfully'), done(null, builder.scripts.require + jade.runtime + js);
        });
    }

    function buildStyles(done) {
      builder.styles(tree)
        .use('styles', builder.plugins.css())
        .use('styles', stylus())
        .use('styles', builder.plugins.urlRewriter(''))
        .end(function (err, css) {
          if (err) return log('Found error building styles: %s', err), done(err);

          return log('Styles built successfully'), done(null, css);
        });
    }

    function buildFiles(done) {
      builder.files(tree, {destination: 'public'})
        .use('images', builder.plugins.copy())
        .use('files', builder.plugins.copy())
        .end(function () {
          return log('Files copied successfully'), done();
        });
    }
  }
}

/**
 * Express build middleware
 */

function middleware (req, res, next) {
  // Build only script and stylesheet
  if (!/app\.(js|css)/.test(req.path)) {
    return next();
  };

  build(function (err, res) {
    if (err) return next(err);

    log('Write script and stylesheet');
    write('public/app.js', res.js);
    write('public/app.css', res.css);
    next();
  });
};

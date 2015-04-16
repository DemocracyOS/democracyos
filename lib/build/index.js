/**
 * Module dependencies.
 */

var builder = require('component-builder');
var jade = require('builder-jade');
var stylus = require('./stylus');
var fs = require('fs');
var write = fs.writeFileSync;
var log = require('debug')('democracyos:build');
var jade = require('builder-jade');
var Batch = require('batch');
var minify = require('ianstormtaylor-minify');
var resolveTree = require('./resolve-tree');

/**
 * Expose component
 * builder getters
 */

module.exports.build = build;
module.exports.buildScripts = buildScripts;
module.exports.buildStyles = buildStyles;
module.exports.buildFiles = buildFiles;

/**
 * Expose component
 * build middleware.
 */

module.exports.middleware = middleware;

/**
 * Creates a `build` instance
 * ready for build
 */

function build(done, options) {
  log('Start assets compilation')

  if (!options) options = {};

  resolveTree(function(err, tree){
    if (err) return log('Found error resolving dependencies tree %s', err), done(err);

    var batch = new Batch();

    batch.push(function(done){
      buildScripts(done, options);
    });

    batch.push(function(done){
      buildStyles(done, options);
    });

    batch.push(buildFiles);

    batch.end(function (err, results) {
      if (err) return log('Found error compiling assets: %s', err), done(err);

      log('Done compiling assets');
      var res = {};
      res.js = results[0];
      res.css = results[1];

      done(null, res);
    });
  });
}

function buildScripts(done, options) {
  if (!options) options = {};
  resolveTree(function(err, tree){
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
        var code = builder.scripts.require + jade.runtime + js;
        if (options.compress) code = minify.js(code);
        return log('Scripts built successfully'), done(null, code);
      });
  });
}

function buildStyles(done, options) {
  if (!options) options = {};
  resolveTree(function(err, tree){
    builder.styles(tree)
      .use('styles', builder.plugins.css())
      .use('styles', stylus())
      .use('styles', builder.plugins.urlRewriter(''))
      .end(function (err, css) {
        if (err) return log('Found error building styles: %s', err), done(err);
        if (options.compress) css = minify.css(css);
        return log('Styles built successfully'), done(null, css);
      });
  });
}

function buildFiles(done, options) {
  if (!options) options = {};
  resolveTree(function(err, tree){
    builder.files(tree, { destination: 'public' })
      .use('images', builder.plugins.copy())
      .use('files', builder.plugins.copy())
      .end(function () {
        return log('Files copied successfully'), done();
      });
  });
}

/**
 * Express build middleware
 */

function middleware (req, res, next) {
  if (/app\.js/.test(req.path)) {
    buildScripts(function (err, js) {
      if (err) return next(err);
      log('Write scripts');
      write('public/app.js', js);
      next();
    });
    return;
  }

  if (/app\.css/.test(req.path)) {
    buildStyles(function (err, css) {
      if (err) return next(err);
      log('Write scripts');
      write('public/app.css', css);
      next();
    });
    return;
  }

  next();
};

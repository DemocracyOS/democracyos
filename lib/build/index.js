/**
 * Module dependencies.
 */

var builder = require('component-builder');
var jade = require('builder-jade');
var stylus = require('./stylus');
var fs = require('fs');
var write = fs.writeFileSync;
var log = require('debug')('democracyos:build');
var mkdir = require('mkdirp');
var resolve = require('component-resolver');
var jade = require('builder-jade');

/**
 * Expose component
 * builder getter
 */

module.exports = build;

/**
 * Expose component
 * build middleware.
 */

module.exports.middleware = middleware;

/**
 * Creates a `Builder` instance
 * ready for build
 */

function build(next) {
  resolve(process.cwd(), {
    // install the remote components locally
    install: false,
    root: 'public'
  }, function (err, tree) {
    if (err) console.log(err), process.exit(1);

    mkdir('public');

    builder.scripts(tree)
      .use('scripts', builder.plugins.js())
      .use('json', builder.plugins.json())
      .use('templates', jade({
        string: false,
        runtime: true
      }))
      .use('templates', builder.plugins.string())
      .end(function (err, js) {
        if (err) throw err;
        write('public/app.js', builder.scripts.require + jade.runtime + js);
      });

    builder.styles(tree)
      .use('styles', builder.plugins.css())
      .use('styles', stylus())
      .use('styles', builder.plugins.urlRewriter(''))
      .end(function (err, string) {
        if (err) throw err;
        fs.writeFileSync('public/app.css', string);
      });

    builder.files(tree, {destination: 'public'})
      .use('images', builder.plugins.copy())
      .use('files', builder.plugins.copy())
      .end();

    if (next) return next();
  })
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
  build(next);
};

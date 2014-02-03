
/**
 * Module dependencies.
 */

var jade = require('jade');
var path = require('path');
var extname = path.extname;
var fs = require('fs');
var read = fs.readFileSync;

/**
 * HTML template plugin used to convert
 * .html files to require()-able javascript
 * on the fly.
 *
 * @param {Builder} builder
 * @api public
 */

module.exports = function(builder) {
  builder.hook('before scripts', jadeCompiler);
  builder.hook('before templates', jadeCleaner);
};

/**
 * Compile `.jade` files into executable
 * `Jade` compiled functions. Hooks before
 * scripts execution
 *
 * @param {Package} pkg
 * @param {Function} done
 * @api private
 */

function jadeCompiler(pkg, done) {

  if (!pkg.config.templates) return done();

  // check if we have .templates in component.json
  var files = pkg.config.templates.filter(jadeFilter);

  files.forEach(compile);

  function compile(file) {
    var filepath = pkg.path(file);
    var content = read(filepath, 'utf8');

    var compiled = 'var jade = require("jade");\n'
      + 'module.exports = '
      + jade.compile(content, {
          client: true,
          pretty: true,
          filename: filepath,
          compileDebug: false
        });

    // consider using `.jade` extension and
    // then be allowed to import `jade`s like
    // `var template = require('template.jade');`
    pkg.addFile('scripts', file.slice(0, -5) + ".js", compiled);
  }

  done();
}

/**
 * Clean `.jade` files from `templates`
 * avoiding to register jade strings
 * and sent to client
 *
 * @param {Package} pkg
 * @param {Function} done
 * @api private
 */

function jadeCleaner(pkg, done) {
  if (!pkg.config.templates) return done();

  var files = pkg.config.templates.filter(jadeFilter);

  files.forEach(remove);

  function remove(file) {
    pkg.removeFile('templates', file);
  }

  done();
}

/**
 * Filter for templates array
 * looking for `.jade` templates
 *
 * @param {String} filename
 * @return {Function} filter func
 * @api private
 */

function jadeFilter(filename) {
  return '.jade' === extname(filename);
}

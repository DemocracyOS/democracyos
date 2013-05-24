
/**
 * Module dependencies.
 */

var str2js = require('string-to-js')
  , path = require('path')
  , fs = require('fs')
  , read = fs.readFileSync

/**
 * HTML template plugin used to convert
 * .html files to require()-able javascript
 * on the fly.
 *
 * @param {Builder} builder
 * @api public
 */

module.exports = function(builder){
  builder.hook('before scripts', function(pkg){
    var tmpls = pkg.config.templates;
    if (!tmpls) return;

    tmpls.forEach(function(file){
      var js = str2js(read(pkg.path(file), 'utf8'));
      var newFile = path.basename(file, '.html') + '.js';
      pkg.addFile('scripts', newFile, js);
    });
  });
};
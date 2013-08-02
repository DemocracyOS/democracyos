
/**
 * Module dependencies.
 */

var path = require('path')
  , fs = require('fs')
  , read = fs.readFileSync

/**
 * JSON plugin used to convert
 * .json files to require()-able javascript
 * on the fly.
 *
 * @param {Builder} builder
 * @api public
 */

module.exports = function(builder) {
  builder.hook('before scripts', function(pkg) {
    // check if we have .files in component.json
    var files = pkg.config.files;
    if (!files) return;

    // translate templates
    files.forEach(function(file) {
      // check extension
      var ext = path.extname(file);
      if ('.json' !== ext) return;

      var js = "module.exports = " + read(pkg.path(file), 'utf8');
      var newFile = path.basename(file, '.json') + '.js';
      
      // add the fabricated script
      pkg.addFile('scripts', newFile, js);
    });
  });
};

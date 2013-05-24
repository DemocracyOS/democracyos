/**
 * Module dependencies.
 */

var Builder = require('component-builder')
  , templates = require('./templates')
  , fs = require('fs')
  , write = fs.writeFileSync

/**
 * Component builder middleware.
 */

module.exports = function(req, res, next){
  var builder = new Builder('.');
  builder.addLookup('lib'); // TODO: shouldn't be necessary
  builder.copyAssetsTo('public');
  builder.use(templates);
  builder.build(function(err, res){
    if (err) return next(err);
    write('public/app.js', res.require + res.js);
    write('public/app.css', res.css);
    next();
  });
};
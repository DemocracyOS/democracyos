/**
 * Module dependencies.
 */

var config = require('lib/config');
var path = require('path');
var resolve = path.resolve;
var html = resolve(__dirname, 'index.jade');

module.exports = function (req, res) {
  res.render(html, { config: config });
};
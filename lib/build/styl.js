/**
 * Module dependencies.
 */

var plugin = require('component-styl-plugin');
var vars = require('rework-vars');
var math = require('rework-math');
var shade = require('rework-shade');

/**
 * Expose build middleware
 */

module.exports = function stylus(builder) {
  plugin.whitespace = true;
  plugin.plugins.push(vars());
  plugin.plugins.push(math());
  plugin.plugins.push(shade());
  builder.use(plugin);
};
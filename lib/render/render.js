/**
 * Module dependencies.
 */

var domify = require('domify');
var merge = require('merge-util');

/**
 * Render default modules
 */

var citizen = require('citizen');
var translation = require('t');
var config = require('config');

exports = module.exports = render;
exports.dom = dom;

function render(template, options) {
  var defaults = {
    citizen: citizen,
    t: translation,
    config: config
  };

  return template(merge(defaults, options, true));
}

function dom(template, options) {
  return domify(render(template, options));
}

/**
 * Module dependencies.
 */

var query = require('query');
var config = require('config');

/**
 * Expose title
 */

module.exports = title;

/**
 * Change head's title or restore with
 * one from config `organization name`
 *
 * @param {String} str
 * @api public
 */

function title(str) {
  o('head title').innerHTML = (str || config['organization name']);
}
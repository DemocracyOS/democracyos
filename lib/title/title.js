/**
 * Module dependencies.
 */

var o = require('query');
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
  var title = config['organization name']
    + ( str ? ' - ' + str : '');

  o('head title').innerHTML = title;
}
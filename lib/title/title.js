/**
 * Module dependencies.
 */

var o = require('dom');
var config = require('../config/config');

/**
 * Expose title
 */

module.exports = title;

/**
 * Change head's title or restore with
 * one from config `organizationName`
 *
 * @param {String} str
 * @api public
 */

function title(str) {
  var title = config.organizationName
    + ( str ? ' - ' + str : '');

  o('head title').html(title);
}
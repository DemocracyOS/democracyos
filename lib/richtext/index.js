/**
 * Server-side helper functions to handle QuillJS input
 */

var xssFilter = require('./lib/xss-filter')

module.exports = {}
module.exports.xssFilter = xssFilter

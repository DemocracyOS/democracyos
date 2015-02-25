/**
 * Module dependencies.
 */

var config = require('config');
var debug = require('debug');

/**
 * Initialize debug
 */

if (config['client debug'] && true === config['client debug']) {
  debug.disable();
  debug.enable('democracyos:*');
} else if (config['client debug'] && 'string' === typeof config['client debug']) {
  debug.disable();
  debug.enable(config['client debug']);
} else {
  debug.disable();
}

module.exports = debug;

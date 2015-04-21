/**
 * Module dependencies.
 */

var config = require('config');
var debug = require('debug');

/**
 * Initialize debug
 */

if (config['clientDebug'] && true === config['clientDebug']) {
  debug.disable();
  debug.enable('democracyos:*');
} else if (config['clientDebug'] && 'string' === typeof config['clientDebug']) {
  debug.disable();
  debug.enable(config['clientDebug']);
} else {
  debug.disable();
}

module.exports = debug;

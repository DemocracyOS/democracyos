/**
 * Module dependencies.
 */

var config = require('config');
var debug = require('debug');

/**
 * Initialize debug
 */

debug.disable();

if (config.clientDebug === '*') {
  debug.enable('democracyos:*');
} else if (config.clientDebug) {
  debug.enable(config.clientDebug);
}

module.exports = debug;

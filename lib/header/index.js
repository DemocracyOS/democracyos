/**
 * Module dependencies.
 */

var Header = require('./view');

/**
 * Create header instance and expose it
 */

var header = module.exports = new Header();

// Render header
header.replace('header.app-header');
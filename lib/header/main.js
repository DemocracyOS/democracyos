/**
 * Module dependencies.
 */

var Header = require('./header');

/**
 * Create sidebar instance and expose
 */

var header = module.exports = new Header();

// Render sidebar
header.render('header.app-header');
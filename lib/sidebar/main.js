/**
 * Module dependencies.
 */

var Sidebar = require('./sidebar');

/**
 * Create sidebar instance and expose
 */

var sidebar = module.exports = new Sidebar();

// Render sidebar
sidebar.appendTo('aside.nav-proposal');
/**
 * Module dependencies.
 */

var View = require('./view');

/**
 * Create sidebar instance and expose
 */

var sidebar = module.exports = new View();

// Render sidebar
sidebar.render('aside.nav-proposal');
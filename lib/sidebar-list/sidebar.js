/**
 * Module dependencies.
 */

var View = require('./view');
var o = require('query');
var log = require('debug')('democracyos:sidebar-list');

/**
 * Create sidebar instance and expose
 */

var sidebar = module.exports = new View();

sidebar.render('aside.nav-proposal');

// filter.ready(onitems.bind(sidebar));

// filter.on('change', onitems.bind(sidebar));

// function onitems() {
//   var items = filter.get('items');
//   this.set(items);
// }
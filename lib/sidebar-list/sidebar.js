/**
 * Module dependencies.
 */

var Sidebar = require('./view');
var laws = require('laws')
// var filter = require('laws-filter');
var filter = require('./filter');
var o = require('query');
var log = require('debug')('democracyos:sidebar-list');

/**
 * Create sidebar instance and expose
 */

var sidebar = module.exports = new Sidebar();

// filter.render(o('#filter-container', sidebar.el));
/**
 * Load laws
 */

laws.ready(function() {
  sidebar.set(laws.get());
});

// filter.ready(onitems.bind(sidebar));


// filter.on('change', onitems.bind(sidebar));

// function onitems() {
//   var items = filter.get('items');
//   this.set(items);
// }
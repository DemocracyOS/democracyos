/**
 * Module dependencies.
 */

var Sidebar = require('./view');
var laws = require('laws')
var t = require('t');
var log = require('debug')('democracyos:sidebar-list');

/**
 * Create sidebar instance and expose
 */

var sidebar = module.exports = new Sidebar([], 'law');

/**
 * Load laws
 */

laws.ready(function() {
  sidebar.set(laws.get());
  sidebar.emit('load');
});

sidebar.ready = function(fn) {
  function done() {
    if (sidebar.items.length) {
      log("ready with %o", sidebar.items);
      return fn();
    }
  }

  if (sidebar.items.length) {
    setTimeout(done, 0);
  } else {
    this.once("load", done);
  }

  return this;
}
/**
 * Module dependencies.
 */

var page = require('page');
var sidebar = require('sidebar-list');
var log = require('debug')('democracyos:homepage');

// Routing.
page('/', function(ctx, next) {
  sidebar.ready(function() {
    var law = sidebar.selected() || sidebar.items[0];
    log('render law %s', law.id);
    ctx.path = '/law/' + law.id;
    next();
  });
});
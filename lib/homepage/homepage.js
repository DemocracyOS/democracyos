/**
 * Module dependencies.
 */

var page = require('page');
var sidebar = require('sidebar');
var classes = require('classes');
var log = require('debug')('democracyos:homepage');

// Routing.
page('/', function(ctx, next) {
  sidebar.ready(onsidebarready);

  function onsidebarready() {
    classes(document.body).add('browser-page');

    var law = sidebar.items(0);

    log('render law %s', law.id);
    ctx.path = '/law/' + law.id;
    next();
  }
});
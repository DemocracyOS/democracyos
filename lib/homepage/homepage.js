/**
 * Module dependencies.
 */

var page = require('page');
var sidebar = require('sidebar');
var o = require('dom');
var t = require('t');
var render = require('render');
var noLaws = require('./no-laws');
var bus = require('bus');
var log = require('debug')('democracyos:homepage');

// Routing.
page('/', sidebarready, function(ctx, next) {
  o(document.body).addClass('browser-page');

  var law = sidebar.items(0);

  function onpagechange() {
    o(document.body).removeClass('browser-page');
  }

  if (!law) {
    var el = render.dom(noLaws);
    o('#browser .app-content').empty().append(el);
    bus.once('page:change', onpagechange);
    return bus.emit('page:render');
  }

  log('render law %s', law.id);
  ctx.path = '/law/' + law.id;
  next();
});

function sidebarready(ctx, next) {
  sidebar.ready(next);
}
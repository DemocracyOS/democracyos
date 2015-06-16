/**
 * Module dependencies.
 */

var page = require('page');
var o = require('dom');
var render = require('render');
var noLaws = require('./no-laws');
var createFirstLaw = require('./create-first-law');
var bus = require('bus');
var log = require('debug')('democracyos:homepage');
var citizen = require('citizen');
var visibility = require('visibility');
var lawsFilter = require('laws-filter');
var laws = require('laws');

// Routing.
page('/', citizen.optional, visibility, laws.middleware, lawsFilter.middleware, function(ctx, next) {
  o(document.body).addClass('browser-page');

  var law = lawsFilter.items()[0];

  var pageChanged = false;
  function onpagechange() {
    pageChanged = true;
    o(document.body).removeClass('browser-page');
  }

  if (!law) {
    var content = o('#browser .app-content');
    var el = render.dom(noLaws);
    content.empty().append(el);
    citizen.ready(function(){
      if (pageChanged) return;
      if (citizen.staff) {
        var el = render.dom(createFirstLaw);
        content.append(el);
      }
    });
    bus.once('page:change', onpagechange);
    return bus.emit('page:render');
  }

  log('render law %s', law.id);
  ctx.path = '/law/' + law.id;
  next();
});

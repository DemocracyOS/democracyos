/**
 * Module dependencies.
 */

var bus = require('bus');
var page = require('page');
var classes = require('classes');
var View = require('./view');
var title = require('title');
var empty = require('empty');
var sidebar = require('sidebar')
var o = require('query');
var t = require('t');
var locker = require('browser-lock');

/**
 * Markdown routing
 */

page('/markdown',  function(ctx, next) {
  
  bus.emit('page:render');

  sidebar.ready(onsidebarready);

  function onsidebarready() {

    classes(document.body).add('browser-page');
    
    locker.unlock();

    // Clean page's content
    empty(o('section.app-content'))

    // Build form view with options
    var form = new View();

    // Update page's title
    title(t('DemocracyOS markdown'));

    // Empty container and render form
    empty(o('section.app-content')).appendChild(form.render());

  }

});
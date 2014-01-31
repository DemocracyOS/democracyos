/**
 * Module dependencies.
 */

var template = require('./admin-container');
var sidebar = require('admin-sidebar')();
// var Laws = require('admin-laws');
var classes = require('classes');
var citizen = require('citizen');
var render = require('render');
var title = require('title');
var empty = require('empty');
var page = require('page');
var o = require('query');

page("/admin/:section?", valid, citizen.required, function(ctx, next) {
  var section = ctx.params.section;
  var container = render.dom(template);
  var content = o('.admin-content', container);

  // var laws = new Laws;

  // prepare wrapper and container
  empty(o('#content')).appendChild(container);

  // set active section on sidebar
  sidebar.set(section);
  sidebar.render(o('.sidebar-container', container));

  // Set page's title
  title(o('[href="/admin/' + section + '"]').textContent);

  // render all admin pages
  // laws.render(content);

  // Display current admin page
  // classes(o("#" + section + "-wrapper", container)).remove("hide");
});

/**
 * Check if page is valid
 */

function valid(ctx, next) {
  var section = ctx.params.section = ctx.params.section || "laws";
  if (~['laws'].indexOf(section)) return next();
  // if else, I should render 404... or redirect home
}
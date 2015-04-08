/**
 * Module dependencies.
 */

var AdminWhitelists = require('./view');
var page = require('page');
var request = require('request');
var sidebar = require('admin-sidebar');
var whitelists = require('whitelists');

page('/admin/users', whitelists.middleware, function (ctx, next) {
  var view = new AdminWhitelists(whitelists.get());
  view.replace('.admin-content');
  sidebar.set('users');
});

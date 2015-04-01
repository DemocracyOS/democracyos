/**
 * Module dependencies.
 */

var AdminUsers = require('./view');
var page = require('page');
var sidebar = require('admin-sidebar');

page('/admin/users', function (ctx, next) {
  var view = new AdminUsers();
  view.replace('.admin-content');
  sidebar.set('users');
});

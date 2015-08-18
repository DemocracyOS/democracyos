/**
 * Module dependencies.
 */

var AdminWhitelists = require('./view');
var page = require('page');
var sidebar = require('../admin-sidebar');
var whitelists = require('../whitelists/whitelists.js');

page('/admin/users', whitelists.middleware, function (ctx, next) {
  var view = new AdminWhitelists(whitelists.get());
  view.replace('.admin-content');
  sidebar.set('users');
});

/**
 * Module dependencies.
 */

var AdminWhitelists = require('./view');
var page = require('page');
var request = require('request');
var sidebar = require('admin-sidebar');

page('/admin/users', load, function (ctx, next) {
  var view = new AdminWhitelists(ctx.whitelists);
  view.replace('.admin-content');
  sidebar.set('users');
});

function load(ctx, next) {
  request
    .get('/api/whitelists/all')
    .end(function (err, res) {
      if (err) alert('error');

      ctx.whitelists = res.body;
      next();
    });
}
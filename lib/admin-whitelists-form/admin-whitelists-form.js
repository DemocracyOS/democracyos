/**
 * Module dependencies.
 */

var log = require('debug')('democracyos:admin-whitelists-form');
var page = require('page');
var FormView = require('./form-view');

page('/admin/users/create', function (ctx, next) {
  var form = new FormView();
  form.replace('.admin-content');
});
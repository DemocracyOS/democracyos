/**
 * Module dependencies.
 */

var page = require('page');
var form = require('./form');
var domify = require('domify');
var request = require('superagent');
var empty = require('empty');

page('/signup', function(ctx, next) {
  var formEl = domify(form());
  empty(document.querySelector('section.app-content'))
  .appendChild(formEl);
});
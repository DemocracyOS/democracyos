/*
 * Module dependencies.
 */

var citizen = require('citizen');
var config = require('config');
var page = require('page');

var hidden = config.visibility == 'hidden';

module.exports = function (ctx, next) {
  if (!hidden) return next();
  if (citizen.logged()) return next();

  page('/signin');
};

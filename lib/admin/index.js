/**
 * Module dependencies.
 */

var express = require('express');
var utils = require('lib/utils');
var restrict = utils.restrict;
var log = require('debug')('democracyos:admin');
var t = require('t-component');
var config = require('lib/config');
var Router = require('lib/router');

/**
 * Exports Application
 */

var app = module.exports = express();

var router = Router(config);

app.get(router('/admin'), require('lib/layout'));
app.get(router('/admin/topics'), require('lib/layout'));
app.get(router('/admin/topics/:id'), require('lib/layout'));
app.get(router('/admin/topics/create'), require('lib/layout'));
app.get(router('/admin/tags'), require('lib/layout'));
app.get(router('/admin/tags/:id'), require('lib/layout'));
app.get(router('/admin/tags/create'), require('lib/layout'));
app.get(router('/admin/users'), require('lib/layout'));
app.get(router('/admin/users/create'), require('lib/layout'));
app.get(router('/admin/users/:id'), require('lib/layout'));

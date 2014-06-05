/**
 * Module dependencies.
 */

var express = require('express');
var utils = require('lib/utils');
var restrict = utils.restrict;
var log = require('debug')('democracyos:admin');
var t = require('t-component');

/**
 * Exports Application
 */

var app = module.exports = express();

app.get('/admin', require('lib/layout'));
app.get('/admin/laws', require('lib/layout'));
app.get('/admin/laws/:id', require('lib/layout'));
app.get('/admin/laws/create', require('lib/layout'));
app.get('/admin/tags', require('lib/layout'));
app.get('/admin/tags/:id', require('lib/layout'));
app.get('/admin/tags/create', require('lib/layout'));
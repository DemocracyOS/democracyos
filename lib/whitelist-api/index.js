/**
 * Module dependencies.
 */

var express = require('express');
var api = require('lib/db-api');
var utils = require('lib/utils');
var accepts = require('lib/accepts');
var restrict = utils.restrict;
var staff = utils.staff;
var pluck = utils.pluck;
var expose = utils.expose;
var log = require('debug')('democracyos:user');
var config = require('lib/config');
var utils = require('lib/utils');

var app = module.exports = express();

/**
 * Limit request to json format only
 */

app.use(accepts('application/json'));

app.get('/whitelists/all', function (req, res) {
  log('Request /users/all');

  var page = req.query.page || 0;
  var search = req.query.search || null;
  var query = { page: page, search: search };

  
});
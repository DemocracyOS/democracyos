/**
 * Extend module's NODE_PATH
 * HACK: temporary solution
 */

require('node-path')(module);

/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var lawApi = require('lib/db-api').law;
var log = require('debug')('democracyos:db-api:clause');

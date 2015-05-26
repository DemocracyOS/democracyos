/**
 * Extend module's NODE_PATH
 * HACK: temporary solution
 */

require('node-path')(module);

/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var topicApi = require('lib/db-api').topic;
var log = require('debug')('democracyos:db-api:clause');

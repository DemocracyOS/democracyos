/**
 * Module dependencies.
 */

var client = require('./client');

module.exports = window.config ? window.config : client;

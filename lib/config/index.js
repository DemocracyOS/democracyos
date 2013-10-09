/**
 * Extend module's NODE_PATH
 * HACK: temporary solution
 */

var resolve = require('path').resolve;
require(resolve('lib/node-path'))(module);

/**
 * Module dependencies.
 */

var log = require('debug')('democracyos:config');
var environment = process.env.NODE_ENV || "development";
var resolve = require('path').resolve;
var utils = require('lib/utils');
var envConf = require('./env');

var filepath = resolve(__dirname, "..", "..", "config", environment + ".json");

var localConf = {};

try {
  log('Attempt to load local conf for %s env', environment);
  localConf = require(filepath);
} catch (e) {
  log('Found error: %s', e.message);
  log('Loading config settings from machine environment vars only');
}

log('Attempt to merge machine environment config vars');
var conf = utils.merge(localConf, envConf);
conf.env = environment;

log('Loaded config object %j', conf);

module.exports = config;

function config(key) {
  if (conf.hasOwnProperty(key)) return conf[key];
  log('Invalid config key "%s"', key);
  throw new Error('Invalid config key "' + key + '"');
}

for (var key in conf) config[key] = conf[key];
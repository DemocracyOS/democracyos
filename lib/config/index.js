/**
 * Extend module's NODE_PATH
 * HACK: temporary solution
 */

require('node-path')(module);

/**
 * Module dependencies.
 */

var log = require('debug')('democracyos:config');
var environment = process.env.NODE_ENV || "development";
var resolve = require('path').resolve;
var merge = require('merge-util');
var utils = require('lib/utils');
var has = utils.has;
var md5 = utils.md5;
var envConf = require('./env');

var filepath = resolve(__dirname, "..", "..", "config", environment + ".json");

var localConf = {};

try {
  log('Load local configuration from %s', filepath);
  localConf = require(filepath);
} catch (e) {
  log('Found error: %s', e.message);
}

log('Merge environment set configuration variables');
var conf = merge(localConf, envConf);
conf.env = environment;

log('Loaded config object for env %s with sha %j', environment, md5(JSON.stringify(conf)));

module.exports = config;

function config(key) {
  if (has.call(conf, key)) return conf[key];
  log('Invalid config key "%s"', key);
  // throw new Error('Invalid config key "' + key + '"');
  return undefined;
}

for (var key in conf) config[key] = conf[key];
var log = require('debug')('democracyos:config');
var resolve = require('path').resolve;
var path = require('path');
var typeOf = require('component-type');
var changeCase = require('change-case');
var cast = require('./cast-string');

var env = process.env;
var environment = env.NODE_ENV || 'development';

var configPath = resolve(__dirname, '..', '..', 'config');
var defaultsPath = resolve(configPath, 'defaults.json');
var envPath = resolve(configPath, environment + '.json');

var defaultConfig = require(defaultsPath);
var localConfig = fs.existsSync(envPath) && require(envPath) || {};
var config = {};

forEach(defaultConfig, parse);

function parse(val, key, scope){
  var c = get(config, scope);
  var s = scope ? scope.slice(0) : [];

  if (typeOf(val) === 'object') {
    c[key] = {};
    forEach(val, parse, s.concat(key));
    return;
  }

  var envKey = s.concat(key).map(changeCase.constantCase).join('_');
  if (env.hasOwnProperty(envKey)) {
    var newVal;
    try {
      newVal = cast(typeOf(val), env[envKey]);
    } catch(e) {
      throw new Error('There was an error when parsing ENV "' + envKey + '": ' + e);
    }
    return c[key] = newVal;
  }

  var local = get(localConfig, s);
  if (local.hasOwnProperty(key)) {
    var newVal = local[key];
    if (typeOf(val) !== typeOf(newVal)) {
      throw new Error('Invalid value for key "' + key + '" on "' + environment + '.json": ' + '". Should be "' + typeOf(val) + '".');
    }
    return c[key] = newVal;
  }

  c[key] = val;
}

function get(obj, scope) {
  var c = obj;
  if (scope) scope.forEach(function(k){ c = c[k] });
  return c;
}

function forEach(obj, cb) {
  var extraArgs = [].slice.call(arguments, 2);
  Object.keys(obj).forEach(function(key) {
    var val = obj[key];
    var args = [val, key];
    if (extraArgs.length) args = args.concat(extraArgs);
    cb.apply(obj, args);
  });
}

module.exports = config;
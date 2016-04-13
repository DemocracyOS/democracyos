/**
* Configuration
*
* - Default config options will be loaded from `/config/defaults.json`. Also it
*   will be used as reference for the Type the values should have.
*
* - Environment specific overrides are optional, using `/config/{NODE_ENV}.json`.
*
* - Environment Variables also can be used to override options (recommended for
*   production).
*   + Var names should be CONSTANT_CASE.
*     + e.g.: `mongoUrl` => `MONGO_URL`
*     + Scoped variables e.g.: `notifications.url` => `NOTIFICATIONS_URL`
*   + `Arrays`s should be strings separated by commas.
*     + e.g.: `"staff": ["mail@eg.com", "a@c.m"]` => `STAFF="mail@eg.com,a@c.m"`
*   + `Boolean`s should be `true` or `false` as strings.
*     + e.g.: `"rssEnabled": false` => `RSS_ENABLED="false"`
*   + Var Types are casted using `./cast-string.js`
**/

var log = require('debug')('democracyos:config');
var path = require('path');
var resolve = path.resolve;
var fs = require('fs');
var typeOf = require('component-type');
var changeCase = require('change-case');
var cast = require('./cast-string');
var crypto = require('crypto');
var normalizeEmail = require('../normalize-email/normalize-email');

var env = process.env;
var environment = env.NODE_ENV || 'development';

var configPath = resolve(__dirname, '..', '..', 'config');
var defaultsPath = resolve(configPath, 'defaults.json');
var envPath = resolve(configPath, environment + '.json');

var defaultConfig = require(defaultsPath);
var localConfig = fs.existsSync(envPath) && require(envPath) || {};
var config = {};

forEach(defaultConfig, parse);

function parse(val, key, scope){
  var s = scope ? scope.slice(0) : [];
  var c = get(config, s);

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
  if (local && local.hasOwnProperty(key)) {
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
  if (scope) scope.forEach(function(k){ c = c ? c[k] : null; });
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

config.env = environment;

if (!config.jwtSecret || config.jwtSecret === defaultConfig.jwtSecret) {
  var token = crypto.randomBytes(32).toString('hex');
  log('Should set a unique token for your app on the "jwtSecret" key of the configuration. Here\'s one just for you: "' + token + '".\n');
}

config.staff = config.staff.map(function (email) {
  return normalizeEmail(email, {
    allowEmailAliases: config.allowEmailAliases
  });
});

config.mongoUrl = env.MONGO_URL || env.MONGODB_URI || config.mongoUrl;

if (!env.NOTIFICATIONS_MAILER_SERVICE) {
  if (env.SENDGRID_USERNAME && env.SENDGRID_PASSWORD) {
    config.notifications = {
      mailer: {
        service: 'sendgrid',
        auth: {
          user: env.SENDGRID_USERNAME,
          pass: env.SENDGRID_PASSWORD
        },
        name: config.notifications.mailer.name,
        email: config.notifications.mailer.email
      }
    };
  }
}

module.exports = config;

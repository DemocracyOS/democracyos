var log = require('debug')('democracyos:jwt');
var config = require('lib/config');
var jwt = require('jwt-simple');
var moment = require('moment');
var utils = require('lib/utils');
var expose = utils.expose;

exports.encodeToken = function encodeToken(user, secret) {
  var expires = moment().add(7, 'days').valueOf();
  var token = jwt.encode({
    iss: user.email,
    exp: expires
  }, secret);

  return {
    token : token,
    expires: expires,
    user: user
  };
};

exports.decodeToken = function decodeToken(token, secret, cb) {
  try {
    log('Attempting to decode token...');
    var decoded = jwt.decode(token, secret);
    if (decoded.exp <= Date.now()) {
      log('Access token has expired');
      return cb(new Error('Access token has expired'));
    }

    var User = require('lib/models').User;
    User.findByEmail(decoded.iss, function(err, user) {
      if (err) log('Token has been decoded, but user fetching failed with the following error: %s', err);
      if (!user) return log('Token has been decoded, but user was not found'), cb(new Error('No user for token %s', token));

      log('Token decoded successfully');
      return cb(err, user);
    });
  } catch (err) {
    log('Cannot decode token: %s', err);
    return cb(err);
  }
};

exports.signin = function signin(user, req, res) {
  req.user = user;
  var token = exports.encodeToken(confidential(user), config.jwtSecret);
  res.cookie('token', token.token, { domain: resolveDomain(), expires: new Date(token.expires) });
  return res.status(200).send();

  function resolveDomain() {
    return !config.deploymentDomain || 'localhost' === config.deploymentDomain.substring(0, 9)
      ? null
      : '.' + config.deploymentDomain;
  }
};

exports.middlewares = {
  user: function user(secret) {
    return function(req, res, next) {
      var qs = req.query ? req.query.access_token : '';
      var token = req.cookies.token || qs || req.headers['x-access-token'];

      if (token) {
        exports.decodeToken(token, secret, function(err, user) {
          if (err || !user) res.clearCookie('token');
          if (err) return log('Error decoding token: %s', err), next();
          if (!user) return log('No user found for jwt %s', token), next();

          if (config.facebookSignin ) {
            if (user.get('profiles.facebook.deauthorized')) {
              res.clearCookie('token');
              log('Restricting deauthorized facebook user with id "%s"', user.id);
              return next();
            }
          }

          log('Logging in user %s', user.id);
          req.login(user, function(err) {
            if (err) return res.json(500, { error: err.message });
            res.locals.access_token = token;
            next();
          });
        });
      } else {
        log('HTTP header x-access-token has no token. Moving on...');
        return next();
      }
    }
  }
};

function confidential(user) {
  return expose('id firstName lastName email gravatar() staff profilePictureUrl notifications')(user);
}

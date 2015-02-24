var log = require('debug')('democracyos:jwt');
var jwt = require('jwt-simple');
var moment = require('moment');

exports.encodeToken = function encodeToken(user, secret) {
  var expires = moment().add(7, 'days').valueOf();
  var token = jwt.encode({
    iss: user.email,
    exp: expires
  }, secret);

  return {
    token : token,
    expires: expires,
    user: user.toJSON()
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
      else log('Token decoded successfully');

      return cb(err, user);
    });
  } catch (err) {
    log('Cannot decode token: %s', err);
    return cb(err);
  }
};

exports.middlewares = {
  user: function user(secret) {
    return function(req, res, next) {
      var qs = req.query ? req.query.access_token : '';
      var token = qs || req.headers['x-access-token'];

      if (token) {
        exports.decodeToken(token, secret, function(err, user) {
          req.user = user;
          return next();
        });
      } else {
        log('HTTP header x-access-token has no token. Moving on...');
        return next();
      }
    }
  }
};
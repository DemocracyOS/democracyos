var log = require('debug')('democracyos:jwt');
var config = require('lib/config');
var moment = require('moment');
var token = require('./token');

var cookieDomain = (function(){
  var domain = config.deploymentDomain;
  return !domain || /^localhost/.test(domain) ? null : '.' + domain;
})();

exports.token = token;

exports.setCookie = function (encoded, res) {
  return res.cookie('token', encoded.token, { domain: cookieDomain, expires: new Date(encoded.expires), httpOnly: true });
};

exports.unsetCookie = function (res) {
  return res.clearCookie('token', { domain: cookieDomain });
};

exports.setUserOnCookie = function (user, res) {
  return exports.setCookie(token.encode(user), res);
};

exports.signin = function signin(user, req, res) {
  req.user = user;
  exports.setUserOnCookie(user, res);
  return res.status(200).send();
};

exports.middlewares = {
  user: function user() {
    return function(req, res, next) {
      var qs = req.query ? req.query.access_token : '';
      var encoded = req.cookies.token || qs || req.headers['x-access-token'];

      if (encoded) {
        token.decode(encoded, function(err, user, decoded) {
          // Remove token and refresh in case on bad cookie.
          if (err || !user) {
            exports.unsetCookie(res);

            if (err) log('Error decoding token: %s', err);
            if (!user) log('No user found for jwt %s', encoded);

            return res.redirect(req.get('referer'));
          }

          if (decoded.exp <= moment().add(1, 'days').valueOf()) {
            log('Refreshing token of user "%s"', user.id);
            exports.setUserOnCookie(user, res);
          }

          if (config.facebookSignin ) {
            if (user.get('profiles.facebook.deauthorized')) {
              exports.unsetCookie(res);
              log('Restricting deauthorized facebook user with id "%s"', user.id);
              return res.redirect(req.get('referer'));
            }
          }

          log('Logging in user %s', user.id);
          req.login(user, function(err) {
            if (err) return res.json(500, { error: err.message });
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

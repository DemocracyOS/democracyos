var log = require('debug')('democracyos:jwt');
var config = require('lib/config');
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
  return res.clearCookie('token', { domain: cookieDomain, httpOnly: true });
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
        token.decode(encoded, function(err, user) {
          // Remove token and refresh in case on bad cookie.
          if (err || !user) {
            exports.unsetCookie(res);

            // Also clear on *.domain, because it has errors.
            clearOldCookies(req, res);

            if (err) log('Error decoding token: %s', err);
            if (!user) log('No user found for jwt %s', encoded);

            return next();
          }

          if (config.facebookSignin ) {
            if (user.get('profiles.facebook.deauthorized')) {
              exports.unsetCookie(res);
              log('Restricting deauthorized facebook user with id "%s"', user.id);
              return next();
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

function clearOldCookies(req, res) {
  var parts = req.get('host').split('.').reverse();
  var domain = [];

  parts.forEach(function(part){
    domain.unshift(part);
    var d = '.' + domain.join('.');
    log('Clearing erroed cookie "token" on "%s"', d);
    res.clearCookie('token', { domain: d });
  });

  return res;
}

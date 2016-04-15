var config = require('lib/config');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('lib/models').User;
var utils = require('lib/utils');

/**
 * Register Google Strategy
 */

module.exports = function() {
  var callbackURL = utils.buildUrl(config, {
    pathname: '/auth/google/callback'
  });

  passport.use(
    new GoogleStrategy({
      clientID: config.auth.google.clientID,
      clientSecret: config.auth.google.clientSecret,
      callbackURL: callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findByProvider(profile, function (err, user) {
        if (err) return done(err);

        if (!user) return signup(profile, accessToken, done);

        var email = profile.emails[0].value;
        if (user.email !== email) {
          user.set('email', email);
          user.set('profiles.google.email', email);
        }

        if (user.profiles.google.deauthorized) {
          user.set('profiles.google.deauthorized');
        }

        user.isModified() ? user.save(done) : done(null, user);
      });
    })
  );
}

/**
 * Google Registration
 *
 * @param {Object} profile PassportJS's profile
 * @param {Function} fn Callback accepting `err` and `user`
 * @api public
 */

function signup (profile, accessToken, fn) {
  var user = new User();

  user.firstName = profile.name.givenName;
  user.lastName = profile.name.familyName;
  user.profiles.google = profile._json;
  user.email = profile.emails[0].value;
  user.emailValidated = true;
  user.profilePictureUrl = profile._json.image.url;

  user.save(function(err) {
    return fn(err, user);
  });
}

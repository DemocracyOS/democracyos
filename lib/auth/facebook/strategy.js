var config = require('lib/config');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('lib/models').User;
var registration = require('lib/registration');

/**
 * Register Facebook Strategy
 */

module.exports = function(app) {
  passport.use(
    new FacebookStrategy({
      clientID: config.auth.facebook.clientID,
      clientSecret: config.auth.facebook.clientSecret,
      callbackURL: config.auth.facebook.callback,
      enableProof: false
    },
    function(accessToken, refreshToken, profile, done) {
      User.findByProvider(profile, function (err, user) {
        if (err) return done(err);

        if (!user) return registration.facebook(profile, accessToken, done);

        var email = profile._json.email;
        if (user.email !== email) {
          user.set('email', email);
          user.set('profiles.facebook.email', email);
        }

        if (user.profiles.facebook.deauthorized) {
          user.set('profiles.facebook.deauthorized');
        }

        user.isModified() ? user.save(done) : done(null, user);
      });
    })
  );
}

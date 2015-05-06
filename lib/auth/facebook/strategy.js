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

        if (!user) {
          User.findByEmail(profile._json.email, function(err, user) {
            if (err) return done(err);

            if (user) {
              user.profiles.facebook = profile._json;
              return user.save(function(err){
                done(err, user);
              });
            }

            return registration.facebook(profile, accessToken, function(err, user) {
              return done(err, user);
            });
          });

          return;
        }

        var email = profile._json.email;
        if (user.email !== email) {
          user.email = email;
          user.profiles.facebook = profile._json;

          return user.save(function(err){
            done(err, user);
          });
        }

        return done(null, user);
      });
    })
  );
}

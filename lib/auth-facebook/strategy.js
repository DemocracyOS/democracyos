var config = require('lib/config');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('lib/models').User;
var utils = require('lib/utils');

/**
 * Register Facebook Strategy
 */

module.exports = function() {
  var callbackURL = utils.buildUrl(config, {
    pathname: '/auth/facebook/callback'
  });

  passport.use(
    new FacebookStrategy({
      clientID: config.auth.facebook.clientID,
      clientSecret: config.auth.facebook.clientSecret,
      callbackURL: callbackURL,
      profileFields: ['id', 'displayName', 'first_name', 'last_name', 'email'],
      enableProof: false
    },
    function(accessToken, refreshToken, profile, done) {
      User.findByProvider(profile, function (err, user) {
        if (err) return done(err);

        if (!user) return signup(profile, accessToken, done);

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

/**
 * Facebook Registration
 *
 * @param {Object} profile PassportJS's profile
 * @param {Function} fn Callback accepting `err` and `user`
 * @api public
 */

function signup (profile, accessToken, fn) {
  var user = new User();

  user.firstName = profile._json.first_name;
  user.lastName = profile._json.last_name;
  user.profiles.facebook = profile._json;
  user.email = profile.emails[0].value;
  user.emailValidated = true;
  user.profilePictureUrl = '//graph.facebook.com/' + profile._json.id + '/picture';

  user.save(function(err) {
    return fn(err, user);
  });
}

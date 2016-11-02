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

function signup (profile, accessToken, done) {
  var email = profile._json.email;
  var profilePictureUrl = '//graph.facebook.com/' + profile._json.id + '/picture';

  // We know this user doesn't have an account created from facebook, but
  // let's check if the same e-mail is registeres to another provider
  User.findByEmail(email, function(err, user) {
    if (err) return done(err);

    // no user with this e-mail, let's create one
    if (!user) {
      var user = new User();
      user.firstName = profile._json.first_name;
      user.lastName = profile._json.last_name;
      user.profiles.facebook = profile._json;
      user.email = email;
      user.emailValidated = true;
      user.profilePictureUrl = profilePictureUrl;

    // there is an user with this e-mail from a different provider, let's
    // update his/her info and add facebook profile
    } else {
      user.set('firstName', profile._json.first_name);
      user.set('lastName', profile._json.last_name);
      user.set('profiles.facebook', profile._json);
      user.set('emailValidated', true);
      user.set('profilePictureUrl', profilePictureUrl);
    }

    user.save(function(err) {
      return done(err, user);
    });

  });
}


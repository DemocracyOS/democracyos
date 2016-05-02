var config = require('lib/config');
var GitlabStrategy = require('passport-gitlab').Strategy;
var passport = require('passport');
var utils = require('lib/utils');
var User = require('lib/models').User;

/**
 * Register Gitlab Strategy
 */
module.exports = function() {
  var callbackURL = utils.buildUrl(config, {
    pathname: '/auth/gitlab/callback'
  });

  passport.use(new GitlabStrategy({
    clientID: config.auth.gitlab.clientID,
    clientSecret: config.auth.gitlab.clientSecret,
    callbackURL: callbackURL,
    gitlabURL: config.auth.gitlab.gitlabURL
  },
    function(accessToken, refreshToken, profile, done) { // eslint-disable-line no-unused-vars
      User.findByProvider(profile, function (err, user) {
        if (err) return done(err);

        if (!user) return signup(profile, accessToken, done);

        var email = profile._json.email;
        if (user.email !== email) {
          user.set('email', email);
          user.set('profiles.gitlab.email', email);
        }

        user.isModified() ? user.save(done) : done(null, user); // eslint-disable-line no-unused-expressions
      });
    }
  ));
};

/**
 * Gitlab Registration
 *
 * @param {Object} profile PassportJS's profile
 * @param {Function} fn Callback accepting `err` and `user`
 * @api public
 */

function signup (profile, accessToken, fn) {
  var user = new User();

  user.firstName = profile._json.name;
  user.lastName = '';
  user.email = profile._json.email;
  user.emailValidated = true;
  user.profilePictureUrl = profile._json.avatar_url;
  user.profiles.gitlab = profile._json;

  user.save(function(err) {
    return fn(err, user);
  });
}

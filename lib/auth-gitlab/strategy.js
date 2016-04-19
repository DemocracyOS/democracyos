var config = require('lib/config');
var GitlabStrategy = require('passport-gitlab').Strategy;
var passport = require('passport');
var utils = require('lib/utils');

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
    }
  ));
};

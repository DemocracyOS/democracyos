/**
 * Module dependencies.
 */

var User = require('lib/models').User;

/**
 * Facebook Registration
 *
 * @param {Object} profile PassportJS's profile
 * @param {Function} fn Callback accepting `err` and `user`
 * @api public
 */

exports.facebook = function facebook (profile, accessToken, fn) {
  var user = new User();

  user.firstName = profile._json.first_name;
  user.lastName = profile._json.last_name;
  user.profiles.facebook = profile._json;
  user.email = profile.emails[0].value;
  user.emailValidated = true;
  user.avatar = profile.imageUrl;

  user.save(function(err) {
    return fn(err, user);
  });
}

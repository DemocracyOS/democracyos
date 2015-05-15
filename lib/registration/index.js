/**
 * Module dependencies.
 */

var User = require('mongoose').model('User');

/**
 * Twitter Registration
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
  user.profilePictureUrl = profile.imageUrl;


  user.save(function(err) {
    return fn(err, user);
  });
}

/**
 * Get image url for profile
 *
 * @param {Object} profile
 * @param {String} email
 * @return {String} Profile image url (or `avatar`)
 * @api private
 */

function getImageUrl (profile, email) {
  return profile.imageUrl
    || 'http://gravatar.com/avatar/'.concat(md5(email)).concat('?d=mm&size=200')
    || '';
}

/**
 * MD5
 *
 * @param {String} source
 * @return {String} target
 * @api private
 */

function md5 (source) {
  return require('crypto')
    .createHash('md5')
    .update(source)
    .digest("hex");
}

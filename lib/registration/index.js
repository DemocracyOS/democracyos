/**
 * Module dependencies.
 */

var log = require('debug')('registration')
  , utils = require('lib/utils')
  , mongoose = require('mongoose');

/**
 * Citizen Model
 */

var Citizen = mongoose.model('Citizen');


/**
 * Facebook Registration
 *
 * @param {Object} profile PassportJS's profile
 * @param {Function} callback Callback accepting `err` and `citizen`
 * @api public
 */

exports.facebook = function facebook (profile, callback) {
  var citizen = new Citizen();

  log('new citizen [%s] from Facebook profile [%s]', citizen.id, profile.username);

  citizen.firstName = profile.name.givenName;
  citizen.lastName = profile.name.familyName;
  // here we should check email. Send email verification and stuff
  citizen.email = profile.emails[0].value;
  citizen.profiles.facebook = profile;
  citizen.avatar = profile.imageUrl || 'http://gravatar.com/avatar/'.concat(utils.md5(citizen.email)).concat('?d=mm&size=200') || '';

  citizen.save(function(err) {
    log('Saved citizen [%s]', citizen.id);
    return callback(err, citizen);
  });
}
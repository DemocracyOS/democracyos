/**
 * Module dependencies.
 */

var log = require('debug')('forgotpassword')
  , mongoose = require('mongoose')
  , api = require('lib/db-api')
  , mailer = require('lib/mailer').mandrillMailer;

/**
 * Citizen Model
 */

var Citizen = mongoose.model('Citizen');


/**
 * Creates a forgot password token and sends it to the citizen by email
 *
 * @param {String} email Email of the citizen who forgot his/her password
 * @param {Function} callback Callback accepting `err` and `citizen`
 * @api public
 */

exports.createToken = function createToken (email, callback) {
  log('password reset requested. email : [%s]', email);
  Citizen.findByEmail(email, function (err, citizen){
    if (err) return callback(err);
    if (!citizen) {
      return callback(new Error("No user for email " + email));
    }
    log('Password reset requested for citizen [%s]', citizen.id);
    api.token.createPasswordResetToken(citizen, function (err, passwordResetToken) {
      if (err) return callback(err);
      log('password reset Token created %j', passwordResetToken);
      var subject = "Password reset requested";
      var body = "Please click here to reset your password";
      mailer.send(citizen, subject, body, function (err) {
        if (err) return callback(err);
        log('password reset mail sent to %j', citizen);
        return callback(err, citizen); 
      });
    });
  });
}

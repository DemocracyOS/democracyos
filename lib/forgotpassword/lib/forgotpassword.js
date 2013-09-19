/**
 * Module dependencies.
 */

var log = require('debug')('forgotpassword')
  , mongoose = require('mongoose')
  , api = require('lib/db-api')
  , mailer = require('lib/mailer').mandrillMailer
  , jade = require('jade')
  , fs = require('fs')
  ;

/**
 * Citizen Model
 */

var Citizen = mongoose.model('Citizen');

var baseUrl = "http://localhost:3005";
var path = require('path');
var resolve = path.resolve;
var rawJade = fs.readFileSync(resolve(__dirname, '../mail.jade'));
var template = jade.compile(rawJade);

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
      var htmlBody = template({
        citizenName: citizen.fullName,
        forgotPasswordNewPasswordFormUrl: baseUrl+"/forgotpassword/step2?token="+passwordResetToken.id
      });
      mailer.send(citizen, subject, htmlBody, function (err) {
        if (err) return callback(err);
        log('password reset mail sent to %s', citizen.email);
        return callback(err, citizen); 
      });
    });
  });
}

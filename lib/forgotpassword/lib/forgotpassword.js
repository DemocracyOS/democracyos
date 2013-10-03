/**
 * Module dependencies.
 */

var log = require('debug')('forgotpassword')
  , mongoose = require('mongoose')
  , api = require('lib/db-api')
  , mailer = require('lib/mailer').mandrillMailer
  , jade = require('jade')
  , fs = require('fs')
  , t = require('t-component')
  ;

var Citizen = mongoose.model('Citizen');
var Token = mongoose.model('Token');

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
  log('password reset token creation requested. email : [%s]', email);
  Citizen.findByEmail(email, function (err, citizen){
    if (err) return callback(err);
    if (!citizen) {
      return callback(new Error("No user for email " + email));
    }
    log('Password reset token creation requested for citizen [%s]', citizen.id);
    api.token.createPasswordResetToken(citizen, function (err, passwordResetToken) {
      if (err) return callback(err);
      log('password reset token created %j', passwordResetToken);
      var subject = "Password reset requested";
      var htmlBody = template({
        citizenName: citizen.fullName,
        forgotPasswordNewPasswordFormUrl: baseUrl+"/forgotpassword/step2?token="+passwordResetToken.id,
        t: t
      });
      mailer.send(citizen, subject, htmlBody, function (err) {
        if (err) return callback(err);
        log('password reset mail sent to %s', citizen.email);
        return callback(err, citizen); 
      });
    });
  });
}


/**
 * Verify the token is valid
 *
 * @param {String} token Token id to be validated
 * @param {Function} callback Callback accepting `err` and Token
 * @api public
 */

exports.verifyToken = function verifyToken (tokenId, callback) {
  log('token validation requested. token : [%s]', tokenId);
  api.token.get(tokenId, function (err, token){
    log('Token.findById result err : [%j] token : [%j]', err, token);
    if (err) return callback(err);
    if (!token) {
      return callback(new Error("No token for id " + tokenId));
    }
    return callback(null, token);
  });
}


/**
 * Resets user password if a valid token is provided
 *
 * @param {Object} formData contains password and token 
 * @param {Function} callback Callback accepting `err` and `citizen`
 * @api public
 */

exports.resetPassword = function resetPassowrd (formData, callback) {
  log('password reset requested. token : [%s]', formData.token);
  exports.verifyToken(formData.token, function(err, token){
    if (err) return callback(err);
    log('password reset requested. token : [%s]. token verified', formData.token);
    api.citizen.get(token.user, function (err, citizen){
      if (err) return callback(err);
      log('about to reset password. citizen : [%s].', citizen.id);
      citizen.setPassword(formData.password, function(err) {
        if (err) return callback(err);
        log('password reseted, but citizen not saved yet. citizen : [%s].', citizen.id);
        citizen.save(function (err) {
          if (err) return callback(err);
          log('Saved citizen [%s]', citizen.id);
          return callback(err, citizen);
        });
      });
    });
  });
}

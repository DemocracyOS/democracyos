/**
 * Module dependencies.
 */

var log = require('debug')('democracyos:forgotpassword');
var mongoose = require('mongoose');
var api = require('lib/db-api');
var mailer = require('lib/mailer').mandrillMailer;
var jade = require('jade');
var fs = require('fs');
var t = require('t-component');
var config = require('lib/config');
var url = require('url');

var Citizen = mongoose.model('Citizen');

var path = require('path');
var resolve = path.resolve;
var rawJade = fs.readFileSync(resolve(__dirname, '../mail.jade'));
var template = jade.compile(rawJade);
var notifier = require('notifier-client')(config.notifications);

/**
 * Creates a forgot password token and sends it to the citizen by email
 *
 * @param {String} email Email of the citizen who forgot his/her password
 * @param {Obehect} meta user's ip, user-agent, etc
 * @param {Function} callback Callback accepting `err` and `citizen`
 * @api public
 */

exports.createToken = function createToken (email, meta, callback) {
  log('password reset token creation requested. email : [%s]', email);

  if (2 === arguments.length) {
    callback = meta;
    meta = {};
  }

  Citizen.findByEmail(email, function (err, citizen){
    if (err) return callback(err);
    if (!citizen) {
      return callback(new Error(t("No citizen for email") + " " + email));
    }
    log('Password reset token creation requested for citizen [%s]', citizen.id);
    api.token.createPasswordResetToken(citizen, meta, function (err, token) {
      if (err) return callback(err);
      log('password reset token created %j', token);
      var subject = t('DemocracyOS - Password reset requested');
      var resetUrl = url.format({
          protocol: config('protocol')
        , hostname: config('host')
        , port: config('publicPort')
        , pathname: '/forgot/reset/' + token.id
      });

      var event = 'forgot-password';

      if (notifier.enabled()) {
        notifier.notify(event)
          .to(citizen.email)
          .withData( {
            resetUrl: resetUrl
          })
          .send(function (err, data) {
            if (err) {
              log('Error when sending notification for event %s to user %j', event, citizen);
              return callback(err);
            }

            return callback(null, data);
          });
      } else {
        var htmlBody = template({
          citizenName: citizen.fullName,
          resetUrl: resetUrl,
          t: t
        });

        mailer.send(citizen, subject, htmlBody, { tags: [token.scope] }, function (err) {
          if (err) return callback(err);
          log('password reset mail sent to %s', citizen.email);
          return callback(err, citizen);
        });
      }
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
          token.remove(function (err) {
            if (err) return callback(err);
            log('Token removed [%j]', token);
            return callback(err, citizen);
          });
        });
      });
    });
  });
}

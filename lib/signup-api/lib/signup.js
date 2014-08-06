/**
 * Module dependencies.
 */

var log = require('debug')('democracyos:signup');
var utils = require('lib/utils');
var mongoose = require('mongoose');
var api = require('lib/db-api');
var mailer = require('lib/mailer').mandrillMailer;
var jade = require('jade');
var fs = require('fs');
var t = require('t-component');
var config = require('lib/config');
var url = require('url');
var notifier = require('notifier-client')(config.notifications);

/**
 * Citizen Model
 */

var Citizen = mongoose.model('Citizen');



var path = require('path');
var resolve = path.resolve;
var rawJade = fs.readFileSync(resolve(__dirname, '../mail.jade'));
var template = jade.compile(rawJade);

/**
 * Signups a citizen
 *
 * @param {Object} profile object with local signup data
 * @param {Obehect} meta user's ip, user-agent, etc
 * @param {Function} callback Callback accepting `err` and `citizen`
 * @api public
 */

exports.doSignUp = function doSignUp (profile, meta, callback) {
  var citizen = new Citizen(profile);

  log('new citizen [%s] from Local signup [%s]', citizen.id, profile.email);

  citizen.avatar = 'http://gravatar.com/avatar/'.concat(utils.md5(citizen.email)).concat('?d=mm&size=200');
  citizen.firstName = profile.firstName;
  citizen.lastName = profile.lastName;
  citizen.reference = profile.reference;
  if (config('env') == 'development') citizen.emailValidated = true;
  Citizen.register(citizen, profile.password, function(err, citizen) {
    if (err) return callback(err);
    log('Saved citizen [%s]', citizen.id);
    sendValidationEmail(citizen, 'signup', meta, callback);
  });
}





/**
 * Validates user email if a valid token is provided
 *
 * @param {Object} formData contains token
 * @param {Function} callback Callback accepting `err` and `citizen`
 * @api public
 */

exports.emailValidate = function emailValidate (formData, callback) {
  log('email validate requested. token : [%s]', formData.token);
  var tokenId = formData.token;
  api.token.get(tokenId, function (err, token){
    log('Token.findById result err : [%j] token : [%j]', err, token);
    if (err) return callback(err);
    if (!token) {
      return callback(new Error("No token for id " + tokenId));
    }

    log('email validate requested. token : [%s]. token verified', formData.token);
    api.citizen.get(token.user, function (err, citizen){
      if (err) return callback(err);
      log('about email validate. citizen : [%s].', citizen.id);
      citizen.emailValidated = true;
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
}




/**
 * Sends a new validation email to a citizen
 *
 * @param {Object} profile object with the email address
 * @param {Obehect} meta user's ip, user-agent, etc
 * @param {Function} callback Callback accepting `err` and `citizen`
 * @api public
 */
exports.resendValidationEmail = function resendValidationEmail (profile, meta, callback) {
  log('Resend validation email to [%s] requested', profile.email);

  api.citizen.getByEmail(profile.email, function(err, citizen) {
    if (err) return callback(err);
    if (!citizen) return callback(new Error(t('No citizen found with that email address')));
    log('Resend validation email to citizen [%j] requested', citizen);
    sendValidationEmail(citizen, 'resend-validation', meta, callback);
  });
}

/**
 * Creates a token and sends a validation email to a citizen
 *
 * @param {Object} citizen to send the email to
 * @param {Obehect} meta user's ip, user-agent, etc
 * @param {Function} callback Callback accepting `err` and `citizen`
 */
function sendValidationEmail(citizen, event, meta, callback) {
  api.token.createEmailValidationToken(citizen, meta, function (err, token) {
    if (err) return callback(err);
    log('email validation token created %j', token);

    var validateUrl = url.format({
        protocol: config('protocol')
      , hostname: config('host')
      , port: config('publicPort')
      , pathname: '/signup/validate/' + token.id
      , query: (citizen.reference ? { reference: citizen.reference } : null)
    });

    if (notifier.enabled()) {

      // Notifier enabled, relying on it for signup mail
      var payload = {
        user: citizen.email,
        event: event,
        validateUrl: validateUrl
      }

      notifier.notify(event)
        .to(citizen.email)
        .withData( { validateUrl: validateUrl } )
        .send(function (err, data) {
          if (err) {
            log('Error when sending notification for event %s to user %j', event, citizen);
            return callback(err);
          }

          return callback(null, data);
        })
    } else {

      // Notifier disabled, send mail directly
      var subject = t('DemocracyOS - Welcome!');
      var htmlBody = template({
        citizenName: citizen.fullName,
        validateUrl: validateUrl,
        t: t
      });

      mailer.send(citizen, subject, htmlBody, { tags: [token.scope] }, function (err) {
        if (err) return callback(err);
        log('email validation mail sent to %s', citizen.email);
        return callback(err, citizen);
      });
    }
  });
}
/**
 * Module dependencies.
 */

var log = require('debug')('democracyos:mandrill-mailer');
var mandrill = require('mandrill-api/mandrill');
var config = require('lib/config');
var merge = require('merge-util');

module.exports = function (app) {

}

module.exports.send = function send(citizen, subject, body, options, cb) {
  log('Sending email to citizen %s, subject %s, body %s', citizen, subject, body);

  var mandrillKey = config.mandrillMailer.key;
  var fromEmail = config.mandrillMailer.from.email;
  var fromName = config.mandrillMailer.from.name;
  var mandrill_client = new mandrill.Mandrill(mandrillKey);

  if ('function' === typeof options) {
    cb = options;
    options = {}
  };


  var message = {
    "html": body,
    "text": body,
    "subject": subject,
    "from_email": fromEmail,
    "from_name": fromName,
    "to": [{
            "email": citizen.email,
            "name": citizen.fullName
        }],
    "auto_text" : true
  };

  message = merge(message, options);

  mandrill_client.messages.send({"message": message, "async": false, "ip_pool": "Main Pool", "send_at": null},
    function(result) {
      log(result);
      cb(null);
    },
    function(e) {
      log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
      cb(e);
    }
  );

  return this;
}
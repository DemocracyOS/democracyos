/**
 * Module exports.
 */

module.exports = exports = require('./lib/mailer');

/**
 * Expose Mail
 * 
 * @api public
 */

exports.Mail = require('./lib/mail');


/**
 * Expose Mandrill Mailer
 * 
 * @api public
 */
 
exports.mandrillMailer = require('./lib/mandrill-mailer');
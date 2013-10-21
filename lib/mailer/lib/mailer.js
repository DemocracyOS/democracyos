/**
 * Module dependencies.
 */

var mailer = require('nodemailer')
  , debug = require('debug')('democracyos:mailer:manager')
  , Mail = require('./mail');

/**
 * Expose Mailer
 */

module.exports = Mailer;

/**
 * Mailer Application
 */

function Mailer (options, fn) {
  if(!(this instanceof Mailer)) {
    return new Mailer(options, fn);
  }

  this.setTransport(options, fn);
}

/**
 * Creates transport from options
 * and calls callback function if
 * exists
 *
 * @param {Object} options transport options
 * @param {Function} fn callback after transport creation
 */

Mailer.prototype.setTransport = function(options, fn) {
  var err = null;

  if(this.transport) {
    this.transport.close();
  }

  if(options.auth.user) {
    this.from = options.auth.user;
  }
  
  this.transport = nodemailer.createTransport(options);

  if(!this.transport.transport) err = "Could not create transport";

  fn && fn(err, this.transport);
}

/**
 * Return new Mail with transport
 *
 * @return {Mail} `Mail` instance
 * @api public
 */

Mailer.prototype.create = function() {
  return Mail(this);
}


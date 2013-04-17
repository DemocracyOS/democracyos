/**
 * Module dependencies.
 */

var mailer = require('nodemailer')
  , debug = require('debug')('mailer:manager')
  , Mail = require('./mail');

/**
 * Expose Application Manager
 */

module.exports = Manager;

/**
 * Manager Application
 */

function Manager (opts, fn) {
  if(!(this instanceof Manager)) {
    return new Manager(opts, fn);
  }

  this.setTransport(options, fn);
}

/**
 * Creates transport from options
 * and calls callback function if
 * exists
 *
 *
 */

Manager.prototype.setTransport = function(options, fn) {
  var err = null;

  if(this.transport) {
    this.transport.close();
  }

  if(options.auth.user) {
    this.from = options.auth.user;
  }
  
  this.transport = nodemailer.createTransport(options);

  if(!this.transport.transport) err = "Could not create transport";

  fn && fn(err, transport);
}

/**
 * Sends init application notification
 */

Manager.prototype.initMail = function() {
  this.create()
    .from("Fred Foo ✔ <system@partidodelared.org>")
    .to("Cristian DDD <cristian@gravityonmars.com>")
    .to("Cristian AAA <cristiandouce@yahoo.com.ar>")
    .to("Dasha G. <dasha_gubanova@hotmail.com>")
    .subject('Hellooooooooo')
    .html("<b>Yo Amo a Dashaaaaaaaaa✔</b>")
    .send(function(err, res) {
      console.log(err, res);
    });
}

Manager.prototype.create = function() {
  return Mail(this.transport);
}


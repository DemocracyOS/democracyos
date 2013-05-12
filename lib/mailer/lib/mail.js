/**
 * Creates a mail object with helper methods
 * 
 * @param {Object} mail mail params
 * @param {Mailer} mailer `Mailer` instance
 * @return {Mail} `Mail` instance
 */

function Mail (mail, mailer) {
  if(!(this instanceof Mail)) {
    return new Mail(mail, mailer);
  }

  mailer = mailer || {};
  this.setMailer(mailer);

  this
    .from(mail.from || mailer.from)
    .to(mail.to || [])
    .subject(mail.subject || '')
    .html(mail.html || '')
    .text(mail.text || '')
}

Mail.prototype.from = function(from) {
  this.params.from = from;
  return this;
}

Mail.prototype.to = function(to) {
  if('string' === typeof to) {
    to = to.split(',');
  }

  if(!this.params.to) {
    this.params.to = [];
  }

  this.params.to = this.params.to.concat(to);
  return this;
}

Mail.prototype.subject = function(subject) {
  this.params.subject = subject;
  return this;
}

Mail.prototype.html = function(html) {
  this.params.html = html;
  return this;
}

Mail.prototype.text = function(text) {
  this.params.text = text;
  return this;
}

Mail.prototype.setMailer = function(mailer) {
  this.mailer = mailer;
  return this;
}

Mail.prototype.send = function(cb) {
  if(!mailer) return cb(new Error('No mailer instance for this mail.'));
  
  this.params.to = this.params.to.join(', ');
  this.mailer.send(this.params, cb);
}


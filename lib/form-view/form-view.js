/**
 * Module dependencies.
 */

var autosubmit = require('autosubmit');
var autovalidate = require('autovalidate');
var log = require('debug')('democracyos:form-view');
var inherit = require('inherit');
var isMobile = require('is-mobile')();
var o = require('dom');
var spin = require('spin');
var t = require('t');
var Tip = require('tip');
var validate = require('validate');
var View = require('view');

/**
 * Expose FormView.
 */

module.exports = FormView;

/**
 * Base Form View
 *
 * @return {FormView} `FormView` instance.
 * @api public
 */

function FormView(template, options) {
  if (!(this instanceof FormView))
    return inherit(template, FormView);

  View.call(this, template, options);

  this.autovalidate('form[autovalidate]');
  this.autosubmit('form[autosubmit]');
  this.on('insert', this.bound('oninsert'));
  this.on('remove', this.bound('onremove'));
  this.messages();
}

View(FormView);

FormView.prototype.oninsert = function() {
  this.on('request', this.bound('loading'));
  this.on('response', this.bound('unloading'));
  this.on('response', this.bound('response'));
};

FormView.prototype.onremove = function() {
  this.off();
};

FormView.prototype.removeMessages = function() {
  this.find('li.msg').remove();
};

FormView.prototype.errors = function(msg) {
  this.messages(msg, 'error');
};

FormView.prototype.success = function(msg) {
  this.messages(msg, 'success');
};

FormView.prototype.messages = function(messages, type, fade) {
  this.removeMessages();
  messages = messages || [];
  if ('string' === typeof messages) {
    messages = [messages];
  }
  var ul = this.find('.form-messages');
  if (!ul.length) {
    ul = o('<ul class="form-messages">');
    this.find('form').prepend(ul);
  }

  messages.forEach(function (msg) {
    var li = o(document.createElement('li'));
    li
      .addClass('msg')
      .addClass(type || null)
      .addClass(fade ? 'fade' : null)
      .html(msg);
    ul.append(li);
  });
};

FormView.prototype.disable = function() {
  this.disabled = true;
  validate.disable(this.el);
};

FormView.prototype.enable = function() {
  this.disabled = false;
  validate.enable(this.el);
};

FormView.prototype.spin = function() {
  var but = this.find('button');
  if (!but.length)
    return;
  var self = this;
  this.spinTimer = setTimeout(function() {
    self.spinner = spin(but[0], {size: 20}).light();
    but.addClass("spin")
  }, 500);
};

FormView.prototype.unspin = function() {
  clearTimeout(this.spinTimer);
  if (!this.spinner)
    return;
  this.find('button').removeClass('spin');
  this.spinner.remove();
  this.spinner = null;
};

FormView.prototype.loading = function() {
  var self = this;
  this.disable();
  this.messageTimer = setTimeout(function() {
    self.messages(t('Please wait'), 'sending');
    self.spin();
    self.find('a.cancel').addClass('enabled')
  }, 1000);
};

FormView.prototype.unloading = function() {
  clearTimeout(this.messageTimer);
  this.removeMessages();
  this.unspin();
  this.enable();
  this.find('a.cancel').removeClass('enabled')
};

FormView.prototype.response = function(err, res) {
  if (!res.ok) {
    return this.errors([JSON.parse(res.text).error]);
  };
  if (err || (res.body && res.body.error)) {
    return this.errors([err || res.body.error]);
  };

  this.emit('success', res);
};

FormView.prototype.destroy = function() {
  clearTimeout(this.messageTimer);
  this.unspin();
};

FormView.prototype.field = function(name) {
  var strfind = 'input[name="' + name + '"], textarea[name="' + name + '"]';
  return this.find(strfind);
};

FormView.prototype.get = function(name) {
  var el = this.field(name);
  var chk = 'checkbox' == el.attr('type');
  return chk ? el.attr('checked') ? true : false : el.val();
};

FormView.prototype.set = function(field, val) {
  this.field(field).val(val);
};

FormView.prototype.placeholder = function(field, val) {
  this.field(field).attr('placeholder', val);
};

FormView.prototype.focus = function(field) {
  if (!isMobile)
    this.field(field).focus();
};

FormView.prototype.valid = function(name, print, fn) {
  fn = 'function' == typeof fn ? fn : print;
  print = 'boolean' == typeof print ? print : true;
  var fields = autovalidate.validators(this.field(name));
  var val = this.get(name);
  validate.field(name, fields.validations, val, print, fn);
};

FormView.prototype.reset = function() {
  this.find('form')[0].reset();
};

FormView.prototype.autovalidate = function(selector) {
  var self = this;
  var el = this.find(selector);
  if (!el.length)
    return;
  this.autovalidating = true;
  el.on('submit', function(e) {
    e.preventDefault();
    self.emit('submit');
    autovalidate(el, function(data) {
      self.emit('valid', data);
    })
  });
};

FormView.prototype.autosubmit = function(selector) {
  var self = this;
  var el = this.find(selector);
  if (!el.length)
    return;
  function submit() {
    self.emit('request');
    var postserialize = self.postserialize ? self.postserialize.bind(self) : null;
    var formRequest = autosubmit(el, function(err, res) {
      self.emit('response', err, res);
    }, postserialize);
    formRequest.on('abort', self.onCancel.bind(self));
  }

  el.on('submit', function(e) {
    self.removeMessages();
  });

  if (this.autovalidating) {
    this.on('valid', submit);
  } else {
    el.on('submit', function(e) {
      e.preventDefault();
      self.emit('submit');
      submit();
    });
  }
};

FormView.prototype.onCancel = function(ev) {
  if (ev)
    ev.preventDefault();
  this.emit('cancel');
}
/**
 * Module dependencies.
 */

var autovalidate = require('autovalidate');
var log = require('debug')('democracyos:form-view');
var inherit = require('inherit');
// var isMobile = require('is-mobile');
var o = require('dom');
var spin = require('spin');
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
  this.on('request', this.loading.bind(this));
  this.on('response', this.unloading.bind(this));
  this.message();
}

View(FormView);

FormView.prototype.onkeydown = function(ev) {
  if (this.disabled || !(13 == ev.keyCode && ev.metaKey))
    return;
  log('submit through ⌘↩');
  this.el.find('form')[0].submit();
};

FormView.prototype.removeMessages = function() {
  this.el.find('p.msg').remove();
};

FormView.prototype.error = function(msg) {
  this.message(msg, 'error');
};

FormView.prototype.success = function(msg) {
  this.message(msg, 'success');
};

FormView.prototype.message = function(msg, type, fade) {
  this.removeMessages();
  msg = msg || '';
  type = type || '';
  msg = o('<p class="msg ' + (type || '') + (fade ? ' fade' : '') + '">').html(msg);
  var ph = this.el.find('.msg-placeholder');
  if (!ph.length) {
    ph = o('<div class="msg-placeholder">');
    this.el.find('form').prepend(ph);
  }
  ph.prepend(msg);
};

FormView.prototype.disable = function() {
  this.disabled = true;
  validate.disable('form');
};

FormView.prototype.enable = function() {
  this.disabled = false;
  validate.enable('form');
};

FormView.prototype.spin = function() {
  var but = this.find('button');
  if (!but.length)
    return;
  var self = this;
  this.spinTimer = setTimeout(function() {
    self.spinner = spin(but[0], {size: 20}).light();
    but.addClass("spin")
  }, 300)
};

FormView.prototype.unspin = function() {
  clearTimeout(this.spinTimer);
  if (!this.spinner)
    return;
  this.find('button').removeClass('spin');
  this.spinner.remove();
  this.spinner = null
};

FormView.prototype.loading = function() {
  var self = this;
  this.disable();
  this.messageTimer = setTimeout(function() {
    self.message('Please wait.', 'sending');
    self.spin();
    self.el.find('a.cancel').addClass('enabled')
  }, 500)
};

FormView.prototype.unloading = function() {
  clearTimeout(this.messageTimer);
  this.removeMessages();
  this.unspin();
  this.enable();
  this.el.find('a.cancel').removeClass('enabled')
};

FormView.prototype.destroy = function() {
  clearTimeout(this.messageTimer);
  this.unspin()
};

FormView.prototype.field = function(name) {
  var strfind = 'input[name="' + name + '"], textarea[name="' + name + '"]';
  return this.el.find(strfind)
};

FormView.prototype.get = function(name) {
  var el = this.field(name);
  var chk = 'checkbox' == el.attr('type');
  return chk ? el.attr('checked') ? true : false : el.val()
};

FormView.prototype.set = function(field, val) {
  this.field(field).val(val)
};

FormView.prototype.placeholder = function(field, val) {
  this.field(field).attr('placeholder', val)
};

FormView.prototype.badge = function(field, type, description) {
  var f = this.field(field);
  if (!type) {
    return f.parent().find('.input-badge').remove()
  }
  var badge = o('<div>', {'class': 'input-badge badge-' + type}).insertAfter(f);
  if (description) {
    new Tip(o('<span>', {text: description})).position('south').attach(badge).on('show', function(e) {
      this.el.addClass('tip-' + type)
    })
  }
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

FormView.prototype.autosuggest = function(field) {
  if (!isMobile)
    autosuggest(this.field(field));
};

FormView.prototype.reset = function() {
  this.find('form').get(0).reset();
};

FormView.prototype.autovalidate = function(selector) {
  var self = this;
  var el = this.el.find(selector);
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
  var el = this.el.find(selector);
  if (!el.length)
    return;
  function submit() {
    self.emit('request');
    var formRequest = autosubmit(el, function(res) {
      self.emit('response', res);
    });
    formRequest.on('abort', self.onCancel.bind(self));
  }
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
/**
 * Module dependencies.
 */

var form = require('./form-template');
var serialize = require('serialize');
var images = require('tag-images');
var classes = require('classes');
var Emitter = require('emitter');
var request = require('request');
var regexps = require('regexps');
var events = require('events');
var render = require('render');
var empty = require('empty');
var tags = require('tags');
var o = require('query');
var t = require('t');
var log = require('debug')('democracyos:admin-tags-form');

/**
 * Expose TagForm
 */

module.exports = TagForm;

/**
 * Creates a password edit view
 */

function TagForm(tag) {
  if (!(this instanceof TagForm)) {
    return new TagForm(tag);
  };

  if (tag) {
    this.action = '/tag/' + tag.id;
    this.title = 'admin-tags-form.title.edit';
  } else {
    this.action = '/tag/create';
    this.title = 'admin-tags-form.title.create';
  }

  this.tag = tag;

  this.formsubmit = this.formsubmit.bind(this);
  this.onsuccess = this.onsuccess.bind(this);
  this.onerror = this.onerror.bind(this);

  this.build();
  this.switchOn();
}

/**
 * Mixin with `Emitter`
 */

Emitter(TagForm.prototype);

/**
 * Build view's `this.el`
 */

TagForm.prototype.build = function() {
  this.el = render.dom(form, {
    form: { title: this.title, action: this.action },
    tag: this.tag || { clauses: [] },
    images: images
  });
}

/**
 * Turn on event bindings
 */

TagForm.prototype.switchOn = function() {
  this.events = events(this.el, this);
  this.events.bind('submit form');
  this.on('submit', this.formsubmit);
  this.on('success', this.onsuccess);
  this.on('error', this.onerror);
}

/**
 * Turn off event bindings
 */

TagForm.prototype.switchOff = function() {
  this.events.unbind();
  this.off();
}

/**
 * Handle `onsubmit` form event
 *
 * @param {Event} ev
 * @api private
 */

TagForm.prototype.onsubmit = function(ev) {
  ev.preventDefault();
  
  // Clean errors list
  this.messages();

  // Serialize form
  var form = o('form', this.el);
  var data = serialize.object(form);
  
  // Check for errors in data
  var errors = this.validate(data);

  // If errors, show and exit
  if (errors.length) {
    return this.messages(errors);
  };

  // Deliver form submit
  this.emit('submit', data);
}

/**
 * Handle `submit` event to
 * perform POST request with
 * data
 *
 * @param {Event} ev
 * @api private
 */

TagForm.prototype.formsubmit = function(data) {
  var view = this;

  request
  .post('/api' + this.action)
  .send(data)
  .end(function(err, res) {
    if (err || !res.ok) {
      return log('Fetch error: %o', err || res.error), view.emit('error', res.body || res.text);
    };
    if (res.body && res.body.error) {
      return view.emit('error', res.body.error);
    };

    tags.fetch();
    tags.ready(view.emit('success', res.body));
  });
}

/**
 * Handle `error` event with
 * logging and display
 *
 * @param {String} error
 * @api private
 */

TagForm.prototype.onerror = function(error) {
  log('Error: %o', error);
  this.messages([error]);
}

/**
 * Handle `error` event with
 * logging and display
 *
 * @param {String} error
 * @api private
 */

TagForm.prototype.onsuccess = function() {
  log('Law create successful');
  this.messages([t('admin-tags-form.message.onsuccess')]);
}

/**
 * Validate form's fields
 *
 * @param {Object} data
 * @return {Array} of Errors
 * @api public
 */

TagForm.prototype.validate = function(data) {
  var errors = [];
  if (!data.name.length) {
    errors.push(t('admin-tags-form.message.validation.name-required'));
  };
  return errors;
}

/**
 * Fill messages list
 *
 * @param {Array} msgs
 * @param {string} type
 * @api public
 */

TagForm.prototype.messages = function(msgs, type) {
  var ul = o('ul.form-messages', this.el);

  if (!arguments.length) return empty(ul), this;

  msgs.forEach(function(m) {
    if (!m) return;
    var li = document.createElement('li');
    li.innerHTML = m.message || m;
    classes(li).add(type || 'error');
    ul.appendChild(li);
  });
}

/**
 * Renders to provided `el`
 * or delivers view's `el`
 *
 * @param {Element} el
 * @return {TagForm|Element}
 * @api public
 */

TagForm.prototype.render = function(el) {
  if (1 === arguments.length) {

    // if string, then query element
    if ('string' === typeof el) {
      el = o(el);
    };

    // if it's not currently inserted
    // at `el`, then append to `el`
    if (el !== this.el.parentNode) {
      el.appendChild(this.el);
    };

    return this;
  };

  return this.el;
}
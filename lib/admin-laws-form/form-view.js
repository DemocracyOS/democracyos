/**
 * Module dependencies.
 */

var form = require('./form-template');
var clause = require('./form-clause');
var serialize = require('serialize');
var classes = require('classes');
var Emitter = require('emitter');
var request = require('request');
var regexps = require('regexps');
var closest = require('closest');
var confirm = require('confirmation');
var events = require('events');
var Datepicker = require('datepicker');
var Timepicker = require('timepicker');
var render = require('render');
var empty = require('empty');
var tags = require('tags');
var page = require('page');
var laws = require('laws');
var o = require('query');
var t = require('t');
var log = require('debug')('democracyos:settings-password');

/**
 * Expose LawForm
 */

module.exports = LawForm;

/**
 * Creates a password edit view
 */

function LawForm(law) {
  if (!(this instanceof LawForm)) {
    return new LawForm(law);
  };

  if (law) {
    this.action = '/law/' + law.id;
    this.title = 'admin-laws-form.title.edit';
  } else {
    this.action = '/law/create';
    this.title = 'admin-laws-form.title.create';
  }

  this.law = law;

  this.formsubmit = this.formsubmit.bind(this);
  this.onsuccess = this.onsuccess.bind(this);
  this.onerror = this.onerror.bind(this);

  this.build();
  this.switchOn();
}

/**
 * Mixin with `Emitter`
 */

Emitter(LawForm.prototype);

/**
 * Build view's `this.el`
 */

LawForm.prototype.build = function() {
  this.el = render.dom(form, {
    form: { title: this.title, action: this.action },
    law: this.law || { clauses: [] },
    tags: tags.get()
  });
  this.renderDateTimePickers();
}

/**
 * Turn on event bindings
 */

LawForm.prototype.switchOn = function() {
  this.events = events(this.el, this);
  this.events.bind('submit form');
  this.events.bind('click a.add-clause', 'onaddclauseclick');
  this.events.bind('click a.remove-clause', 'onremoveclauseclick');
  this.events.bind('click a.make-public', 'onmakepublicclick');
  this.events.bind('click a.make-private', 'onmakeprivateclick');
  this.events.bind('click a.delete-law', 'ondeletelawclick');
  this.events.bind('click .clear-closingAt', 'onclearclosingat');
  this.events.bind('click .clear-closingAtTime', 'onclearclosingattime');
  this.on('submit', this.formsubmit);
  this.on('success', this.onsuccess);
  this.on('error', this.onerror);
}

/**
 * Turn off event bindings
 */

LawForm.prototype.switchOff = function() {
  this.events.unbind();
  this.off();
}

/**
 * Handle `onsubmit` form event
 *
 * @param {Event} ev
 * @api private
 */

LawForm.prototype.onsubmit = function(ev) {
  ev.preventDefault();
  
  // Clean errors list
  this.messages();

  // Serialize form
  var form = o('form', this.el);
  var data = serialize.object(form);

  this.parseClauses(data);

  // Check for errors in data
  var errors = this.validate(data);

  // If errors, show and exit
  if (errors.length) {
    return this.messages(errors);
  };

  if (data.closingAt && data.closingAtTime) {
    var d = data.closingAt + ' ' + data.closingAtTime;
    data.closingAt = new Date(d);
  }

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

LawForm.prototype.formsubmit = function(data) {
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

    view.emit('success', res.body);
  });
}

/**
 * Handle `error` event with
 * logging and display
 *
 * @param {String} error
 * @api private
 */

LawForm.prototype.onerror = function(error) {
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

LawForm.prototype.onsuccess = function() {
  log('Law create successful');
  this.messages([t('admin-laws-form.message.onsuccess')]);
}

/**
 * Validate form's fields
 *
 * @param {Object} data
 * @return {Array} of Errors
 * @api public
 */

LawForm.prototype.validate = function(data) {
  var errors = [];
  if (!data.lawId.length) {
    errors.push(t('admin-laws-form.message.validation.lawId-required'));
  };
  if (!data.mediaTitle.length) {
    errors.push(t('admin-laws-form.message.validation.mediaTitle-required'));
  };
  if (!data.source.length) {
    errors.push(t('admin-laws-form.message.validation.source-required'));
  } else if (!regexps.url.test(data.source)) {
    errors.push(t('admin-laws-form.message.validation.source-invalid'));
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

LawForm.prototype.messages = function(msgs, type) {
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
 * Renders datepicker and timepicker
 * elements inside view's `el`
 *
 * @return {LawForm|Element}
 * @api public
 */

 LawForm.prototype.renderDateTimePickers = function() {
  this.closingAt = o('[name=closingAt]', this.el);
  var closingAtTime = this.closingAtTime = o('[name=closingAtTime]', this.el);
  Datepicker(this.closingAt);
  Timepicker(this.closingAtTime)
    .on('change', function(v) {
      closingAtTime.value = (v.hour || '0') + ':' + (v.minute || '00');
    });
  return this;
};

/**
 * Renders to provided `el`
 * or delivers view's `el`
 *
 * @param {Element} el
 * @return {LawForm|Element}
 * @api public
 */

LawForm.prototype.render = function(el) {
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

LawForm.prototype.onaddclauseclick = function(ev) {
  ev.preventDefault();

  var id = this.law ? this.law.id : null;
  if (id != null) return this.addClause();

  // if no law, reveal message forbidden
  classes(o('.add-clause-forbidden', this.el)).remove('hide');
}

LawForm.prototype.addClause = function() {
  var clauses = o('.law-clauses', this.el);

  request
  .post('/api' + this.action + '/clause')
  .end(function (err, res) {
    if (err || !res.ok) return log('Found error %o', err || res.error);
    clauses.appendChild(render.dom(clause, {
      clause: res.body
    }));
  });
}

LawForm.prototype.onremoveclauseclick = function(ev) {
  ev.preventDefault();

  var clause = closest(ev.target, '[data-clause]', true);
  var id = clause ? clause.getAttribute('data-clause') : null;
  if (null == id) return false;

  confirm(t('admin-laws-form.clause.confirmation.title'), t('admin-laws-form.clause.confirmation.body'))
  .cancel(t('admin-laws-form.clause.confirmation.cancel'))
  .ok(t('admin-laws-form.clause.confirmation.ok'))
  .modal()
  .closable()
  .effect('slide')
  .focus()
  .show(onconfirm.bind(this))

  function onconfirm(ok) {
    if (ok) return this.removeClause(id);;
  }
}

LawForm.prototype.removeClause = function(id) {
  var clause = o('[data-clause=' + id + ']');

  request
  .del('/api' + this.action + '/clause')
  .send({ clause: id })
  .end(function (err, res) {
    if (err || !res.ok) return log('Found error %o', err || res.error);
    clause.parentNode.removeChild(clause);
    clause.remove();
  });
}

LawForm.prototype.parseClauses = function(data) {
  data = data || {};
  var clauses = {};
  var regexp = /^clauses\[([a-z0-9]*)\]\[([^\]]*)\]/;

  for (var key in data) {
    var isClause = regexp.test(key)
      && data.hasOwnProperty(key);

    if (isClause) {
      var parsed = regexp.exec(key);
      var id = parsed[1];
      var prop = parsed[2];
      var value = data[key];
      clauses[id] = clauses[id] || {};
      clauses[id][prop] = value;
      delete data[key];
    }
  }

  var ids = Object.keys(clauses);
  var ret = [];

  ids.forEach(function(id) {
    clauses[id].id = id;
    ret.push(clauses[id]);
  });

  data.clauses = ret;
  return data;
}

LawForm.prototype.onmakepublicclick = function(ev) {
  ev.preventDefault();

  var pubContainer = o('.public-status', this.el);
  var privContainer = o('.private-status', this.el);

  classes(privContainer).add('hide');

  request
  .post('/api/law/' + this.law.id + '/publish')
  .end(function (err, res) {
    if (err || !res.ok) return log('Found error %o', err || res.error);
    classes(pubContainer).remove('hide');
    laws.fetch();
  }); 
}

LawForm.prototype.onmakeprivateclick = function(ev) {
  ev.preventDefault();

  var pubContainer = o('.public-status', this.el);
  var privContainer = o('.private-status', this.el);

  classes(pubContainer).add('hide');

  request
  .post('/api/law/' + this.law.id + '/unpublish')
  .end(function (err, res) {
    if (err || !res.ok) return log('Found error %o', err || res.error);
    classes(privContainer).remove('hide');
    laws.fetch();
  });
}

LawForm.prototype.ondeletelawclick = function(ev) {
  ev.preventDefault();

  confirm(t('admin-laws-form.delete-law.confirmation.title'), t('admin-laws-form.delete-law.confirmation.body'))
  .cancel(t('admin-laws-form.delete-law.confirmation.cancel'))
  .ok(t('admin-laws-form.delete-law.confirmation.ok'))
  .modal()
  .closable()
  .effect('slide')
  .focus()
  .show(onconfirmdelete.bind(this))

  function onconfirmdelete(ok) {
    if (!ok) return;

    request
    .post('/api/law/' + this.law.id + '/delete')
    .end(function (err, res) {
      if (err || !res.ok) return log('Found error %o', err || res.error);
      laws.fetch();
      laws.ready(function() {
        page('/admin');
      });
    });
  }
}

LawForm.prototype.onclearclosingat = function(ev) {
  this.closingAt.value = '';
}

LawForm.prototype.onclearclosingattime = function(ev) {
  this.closingAtTime.value = '';
}
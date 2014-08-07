/**
 * Module dependencies.
 */

var clause = require('./clause');
var closest = require('closest');
var confirm = require('confirmation');
var Datepicker = require('datepicker');
var FormView = require('form-view');
var laws = require('laws');
var log = require('debug')('democracyos:settings-password');
var o = require('dom');
var page = require('page');
var render = require('render');
var request = require('request');
var t = require('t');
var tags = require('tags');
var template = require('./template');
var Timepicker = require('timepicker');

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

  this.setLocals(law);

  // this.formsubmit = this.formsubmit.bind(this);
  // this.onsuccess = this.onsuccess.bind(this);

  FormView.call(this, template, this.locals);
  this.renderDateTimePickers();
}

/**
 * Inherit from `FormView`
 */

FormView(LawForm);

/**
 * Set locals for template
 */

LawForm.prototype.setLocals = function(law) {
  if (law) {
    this.action = '/api/law/' + law.id;
    this.title = 'admin-laws-form.title.edit';
  } else {
    this.action = '/api/law/create';
    this.title = 'admin-laws-form.title.create';
  }

  this.law = law;

  this.locals = {
    form: { title: this.title, action: this.action },
    law: this.law || { clauses: [] },
    tags: tags.get()
  };
}

/**
 * Turn on event bindings
 */

LawForm.prototype.switchOn = function() {
  this.bind('click', 'a.add-clause', this.bound('onaddclauseclick'));
  this.bind('click', 'a.remove-clause', this.bound('onremoveclauseclick'));
  this.bind('click', 'a.make-public', this.bound('onmakepublicclick'));
  this.bind('click', 'a.make-private', this.bound('onmakeprivateclick'));
  this.bind('click', 'a.delete-law', this.bound('ondeletelawclick'));
  this.bind('click', '.clear-closingAt', this.bound('onclearclosingat'));
  this.bind('click', '.clear-closingAtTime', this.bound('onclearclosingattime'));
  this.on('success', this.onsuccess);
}

/**
 * Turn off event bindings
 */

LawForm.prototype.switchOff = function() {
  this.unbind('click', 'a.add-clause', this.bound('onaddclauseclick'));
  this.unbind('click', 'a.remove-clause', this.bound('onremoveclauseclick'));
  this.unbind('click', 'a.make-public', this.bound('onmakepublicclick'));
  this.unbind('click', 'a.make-private', this.bound('onmakeprivateclick'));
  this.unbind('click', 'a.delete-law', this.bound('ondeletelawclick'));
  this.unbind('click', '.clear-closingAt', this.bound('onclearclosingat'));
  this.unbind('click', '.clear-closingAtTime', this.bound('onclearclosingattime'));
  this.off();
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
 * Renders datepicker and timepicker
 * elements inside view's `el`
 *
 * @return {LawForm|Element}
 * @api public
 */

 LawForm.prototype.renderDateTimePickers = function() {
  this.closingAt = this.find('[name=closingAt]', this.el);
  var closingAtTime = this.closingAtTime = this.find('[name=closingAtTime]');
  Datepicker(this.closingAt[0]);
  Timepicker(this.closingAtTime[0])
    .on('change', function(v) {
      var value = (v.hour || '0') + ':' + (v.minute || '00');
      closingAtTime.value(value);
    });
  return this;
};

LawForm.prototype.onaddclauseclick = function(ev) {
  ev.preventDefault();

  var id = this.law ? this.law.id : null;
  if (id != null) return this.addClause();

  // if no law, reveal message forbidden
  o('.add-clause-forbidden', this.el).removeClass('hide');
}

LawForm.prototype.addClause = function() {
  var clauses = o('.law-clauses', this.el);

  request
  .post(this.action + '/clause')
  .end(function (err, res) {
    if (err || !res.ok) return log('Found error %o', err || res.error);
    var clauseTemplate = render.dom(clause, {
      clause: res.body
    });
    clauses.append(o(clauseTemplate));
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
  var clause = o('[data-clause="' + id + '"]', this.el);

  request
  .del(this.action + '/clause')
  .send({ clause: id })
  .end(function (err, res) {
    if (err || !res.ok) return log('Found error %o', err || res.error);
    clause[0].remove();
  });
}

LawForm.prototype.postserialize = function(data) {
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

  if (data.closingAt && data.closingAtTime) {
    var d = data.closingAt + ' ' + data.closingAtTime;
    data.closingAt = new Date(d);
  }

  return data;
}

LawForm.prototype.onmakepublicclick = function(ev) {
  ev.preventDefault();

  var pubContainer = o('.public-status', this.el);
  var privContainer = o('.private-status', this.el);

  privContainer.addClass('hide');

  request
  .post('/api/law/' + this.law.id + '/publish')
  .end(function (err, res) {
    if (err || !res.ok) return log('Found error %o', err || res.error);
    pubContainer.removeClass('hide');
    laws.fetch();
  });
}

LawForm.prototype.onmakeprivateclick = function(ev) {
  ev.preventDefault();

  var pubContainer = o('.public-status', this.el);
  var privContainer = o('.private-status', this.el);

  pubContainer.addClass('hide');

  request
  .post('/api/law/' + this.law.id + '/unpublish')
  .end(function (err, res) {
    if (err || !res.ok) return log('Found error %o', err || res.error);
    privContainer.removeClass('hide');
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
  ev.preventDefault();
  this.closingAt.value('');
}

LawForm.prototype.onclearclosingattime = function(ev) {
  ev.preventDefault();
  this.closingAtTime.value('');
}
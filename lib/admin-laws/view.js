/**
 * Module dependencies.
 */

var laws = require('laws');
var template = require('./template');
var t = require('t');
var request = require('request');
var page = require('page');
var o = require('dom');
var List = require('list.js');
var moment = require('moment');
var confirm = require('confirmation');
var View = require('view');

/**
 * Expose LawsListView
 */

module.exports = LawsListView;

/**
 * Creates a list view of laws
 */

function LawsListView() {
  if (!(this instanceof LawsListView)) {
    return new LawsListView();
  };

  var options = { laws: laws.get(), moment: moment };
  View.call(this, template, options);
}

/**
 * Inherit from `View`
 */

View(LawsListView);

LawsListView.prototype.switchOn = function() {
  this.bind('click', '.btn.new', this.bound('onaddtopic'));
  this.bind('click', '.btn.delete-law', this.bound('ondeletelawclick'));
  this.list = new List('laws-wrapper', { valueNames: ['law-title', 'law-id', 'law-date'] });
};

LawsListView.prototype.onaddtopic = function() {
  page('/admin/laws/create');
};

LawsListView.prototype.ondeletelawclick = function(ev) {
  ev.preventDefault();
  var el = ev.target.parentElement.parentElement;
  var lawId = el.getAttribute('data-lawid');

  confirm(t('admin-laws-form.delete-law.confirmation.title'), t('admin-laws-form.delete-law.confirmation.body'))
    .cancel(t('admin-laws-form.delete-law.confirmation.cancel'))
    .ok(t('admin-laws-form.delete-law.confirmation.ok'))
    .modal()
    .closable()
    .effect('slide')
    .focus()
    .show(onconfirmdelete.bind({ lawId: lawId, el: el }));

  function onconfirmdelete(ok) {
    if (!ok) return;
    var view = this;

    request
      .post('/api/law/' + this.lawId + '/delete')
      .end(function (err, res) {
        if (err || !res.ok) return log('Found error %o', err || res.error);
        o(view.el).addClass('hide');
      });
  }
};

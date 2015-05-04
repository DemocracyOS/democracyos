/**
 * Module dependencies.
 */

import laws from '../laws/laws.js';
import template from './template.jade';
import t from 't';
import request from '../request/request.js';
import page from 'page';
import o from 'dom';
import List from 'list.js';
import moment from 'moment';
// import confirm from 'confirmation';
import View from '../view/view.js';

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

  // confirm(t('admin-laws-form.delete-law.confirmation.title'), t('admin-laws-form.delete-law.confirmation.body'))
  //   .cancel(t('admin-laws-form.delete-law.confirmation.cancel'))
  //   .ok(t('admin-laws-form.delete-law.confirmation.ok'))
  //   .modal()
  //   .closable()
  //   .effect('slide')
  //   .focus()
  //   .show(onconfirmdelete.bind({ lawId: lawId, el: el }));

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

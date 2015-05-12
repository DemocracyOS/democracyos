/**
 * Module dependencies.
 */

import clause from './clause.jade';
import linkTemplate from './link.jade';
import closest from 'closest';
import confirm from 'confirmation';
// import Datepicker from 'datepicker';
import FormView from '../form-view/form-view.js';
import laws from '../laws/laws.js';
import debug from 'debug';
import o from 'dom';
import page from 'page';
import { dom as render } from '../render/render.js';
import request from '../request/request.js';
import t from 't';
import tags from '../tags/tags.js';
import template from './template.jade';
import moment from 'moment';
import richtext from '../richtext/richtext.js';
import Toggle from 'toggle';

let log = debug('democracyos:settings-password');

/**
 * Expose LawForm
 */

module.exports = LawForm;

/**
 * Creates a password edit view
 */
var created = false;

export default class LawForm extends FormView {

  constructor(law) {
    super();
    this.setLocals(law);
    super(template, this.locals);

    if (tags.get().length == 0) return;

    this.renderDateTimePickers();
    if (created) {
      this.messages([t('admin-laws-form.message.onsuccess')]);
      created = false;
    }

    this.pubButton = this.find('a.make-public');
    this.privButton = this.find('a.make-private');

    var summary = this.find('textarea[name=summary]');
    new richtext(summary);

    var clauses = this.find('.law-clauses .law-clause .clause-row.text textarea');
    clauses.each(function(textarea) {
      new richtext(textarea);
    });

    this.renderToggles();
  }

  /**
   * Set locals for template
   */

  setLocals(law) {
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
      tags: tags.get(),
      moment: moment
    };
  }

  /**
   * Turn on event bindings
   */

  switchOn() {
    this.bind('click', 'a.add-clause', this.bound('onaddclauseclick'));
    this.bind('click', 'a.remove-clause', this.bound('onremoveclauseclick'));
    this.bind('click', 'a.add-link', this.bound('onaddlinkclick'));
    this.bind('click', 'a.remove-link', this.bound('onremovelinkclick'));
    this.bind('click', 'a.save', this.bound('onsaveclick'));
    this.bind('click', 'a.make-public', this.bound('onmakepublicclick'));
    this.bind('click', 'a.make-private', this.bound('onmakeprivateclick'));
    this.bind('click', 'a.delete-law', this.bound('ondeletelawclick'));
    this.bind('click', '.clear-closingAt', this.bound('onclearclosingat'));
    this.on('success', this.onsuccess);
  }

  /**
   * Handle `error` event with
   * logging and display
   *
   * @param {String} error
   * @api private
   */

  onsuccess(response) {
    log('Law successfully saved');
    if (response.req.url.match(/.*create.*/)) {
      created = true;
      page('/admin/laws/' + response.body.id);
    }
    this.messages([t('admin-laws-form.message.onsuccess')]);
    var content = o('#content')[0];
    content.scrollTop = 0;
  }

  /**
   * Renders datepicker and timepicker
   * elements inside view's `el`
   *
   * @return {LawForm|Element}
   * @api public
   */

   renderDateTimePickers() {
    this.closingAt = this.find('[name=closingAt]', this.el);
    var closingAtTime = this.closingAtTime = this.find('[name=closingAtTime]');
    // Datepicker(this.closingAt[0]);
    return this;
  };

  onaddclauseclick(ev) {
    ev.preventDefault();

    var id = this.law ? this.law.id : null;
    if (id != null) return this.addClause();

    // if no law, reveal message forbidden
    o('.add-clause-forbidden', this.el).removeClass('hide');
  }

  addClause() {
    var clauses = o('.law-clauses', this.el);

    request
    .post(this.action + '/clause')
    .end(function (err, res) {
      if (err || !res.ok) return log('Found error %o', err || res.error);
      var clauseTemplate = render(clause, {
        clause: res.body
      });

      new richtext(o(clauseTemplate).find('.clause-row.text textarea').at(0));
      clauses.append(o(clauseTemplate));
    });
  }

  onremoveclauseclick(ev) {
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
    .show(onconfirm.bind(this))

    function onconfirm(ok) {
      if (ok) return this.removeClause(id);;
    }
  }

  removeClause(id) {
    var clause = o('[data-clause="' + id + '"]', this.el);

    request
    .del(this.action + '/clause')
    .send({ clause: id })
    .end(function (err, res) {
      if (err || !res.ok) return log('Found error %o', err || res.error);
      clause[0].remove();
    });
  }

  onaddlinkclick(ev) {
    ev.preventDefault();

    var id = this.law ? this.law.id : null;
    if (id != null) return this.addLink();

    // if no law, reveal message forbidden
    o('.add-link-forbidden', this.el).removeClass('hide');
  }

  addLink() {
    var links = o('.law-links', this.el);

    request
    .post(this.action + '/link')
    .end(function (err, res) {
      if (err || !res.ok) return log('Found error %o', err || res.error);
      var link = render(linkTemplate, {
        link: res.body
      });
      links.append(o(link));
    });
  }

  onremovelinkclick(ev) {
    ev.preventDefault();

    var link = closest(ev.target, '[data-link]', true);
    var id = link ? link.getAttribute('data-link') : null;
    if (null == id) return false;

    confirm(t('admin-laws-form.link.confirmation.title'), t('admin-laws-form.delete-law.confirmation.body'))
    .cancel(t('admin-laws-form.clause.confirmation.cancel'))
    .ok(t('admin-laws-form.clause.confirmation.ok'))
    .modal()
    .closable()
    .effect('slide')
    .show(onconfirm.bind(this))

    function onconfirm(ok) {
      if (ok) return this.removeLink(id);;
    }
  }

  onsaveclick(ev) {
    ev.preventDefault();
    this.find('form input[type=submit]')[0].click();
  }

  removeLink(id) {
    var link = o('[data-link="' + id + '"]', this.el);

    request
    .del(this.action + '/link')
    .send({ link: id })
    .end(function (err, res) {
      if (err || !res.ok) return log('Found error %o', err || res.error);
      link[0].remove();
    });
  }

  postserialize(data) {
    data = data || {};
    var clauses = {};
    var links = {};
    var clauseregexp = /^clauses\[([a-z0-9]*)\]\[([^\]]*)\]/;
    var linksregexp = /^links\[([a-z0-9]*)\]\[([^\]]*)\]/;

    for (var key in data) {
      var isClause = clauseregexp.test(key)
        && data.hasOwnProperty(key);

      var isLink = linksregexp.test(key)
        && data.hasOwnProperty(key);

      if (isClause) {
        var parsed = clauseregexp.exec(key);
        var id = parsed[1];
        var prop = parsed[2];
        var value = data[key];
        clauses[id] = clauses[id] || {};
        clauses[id][prop] = value;
        delete data[key];
      }

      if (isLink) {
        var parsed = linksregexp.exec(key);
        var id = parsed[1];
        var prop = parsed[2];
        var value = data[key];
        links[id] = links[id] || {};
        links[id][prop] = value;
        delete data[key];
      }
    }

    var clausesids = Object.keys(clauses);
    var linksids = Object.keys(links);
    var clausesret = [];
    var linksret = [];

    clausesids.forEach(function(id) {
      clauses[id].id = id;
      clausesret.push(clauses[id]);
    });

    linksids.forEach(function(id) {
      links[id].id = id;
      linksret.push(links[id]);
    });

    data.clauses = clausesret;
    data.links = linksret;

    if (data.closingAt && data.closingAtTime) {
      var d = data.closingAt + ' ' + data.closingAtTime;
      data.closingAt = new Date(d);
    }

    data.votable = data.votable || false;
    data.author = data.lawAuthor;

    return data;
  }

  onmakepublicclick(ev) {
    ev.preventDefault();
    var view = this;

    this.pubButton.addClass('disabled');

    request
    .post('/api/law/' + this.law.id + '/publish')
    .end(function (err, res) {
      view.pubButton.removeClass('disabled');
      if (err || !res.ok) return log('Found error %o', err || res.error);

      view.pubButton.addClass('hide');
      view.privButton.removeClass('hide');
      laws.fetch();
    });
  }

  onmakeprivateclick(ev) {
    ev.preventDefault();
    var view = this;

    this.privButton.addClass('disabled');

    request
    .post('/api/law/' + this.law.id + '/unpublish')
    .end(function (err, res) {
      view.privButton.removeClass('disabled');
      if (err || !res.ok) return log('Found error %o', err || res.error);

      view.privButton.addClass('hide');
      view.pubButton.removeClass('hide');
      laws.fetch();
    });
  }

  ondeletelawclick(ev) {
    ev.preventDefault();

    confirm(t('admin-laws-form.delete-law.confirmation.title'), t('admin-laws-form.delete-law.confirmation.body'))
    .cancel(t('admin-laws-form.delete-law.confirmation.cancel'))
    .ok(t('admin-laws-form.delete-law.confirmation.ok'))
    .modal()
    .closable()
    .effect('slide')
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

  onclearclosingat(ev) {
    ev.preventDefault();
    this.closingAt.value('');
  }

  renderToggles() {
    var toggle = new Toggle();
    toggle.label('Yes', 'No');
    toggle.name('votable');
    toggle.value(this.law === undefined || this.law.votable === undefined ? true : !!this.law.votable);
    this.find('.votable-toggle').append(toggle.el);
  }

}
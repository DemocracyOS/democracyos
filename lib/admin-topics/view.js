/**
 * Module dependencies.
 */

import template from './template.jade';
import t from 't-component';
import request from '../request/request.js';
import o from 'component-dom';
import List from 'list.js';
import moment from 'moment';
import confirm from 'confirmation-component';
import View from '../view/view.js';

/**
 * Creates a list view of topics
 */

export default class TopicsListView extends View {

  constructor(topics, forum) {
    super(template, { topics, moment, forum });
  }

  switchOn() {
    this.bind('click', '.btn.delete-topic', this.bound('ondeletetopicclick'));
    this.list = new List('topics-wrapper', { valueNames: ['topic-title', 'topic-id', 'topic-date'] });
  }

  ondeletetopicclick(ev) {
    ev.preventDefault();
    var el = ev.target.parentElement.parentElement;
    var topicId = el.getAttribute('data-topicid');

    confirm(t('admin-topics-form.delete-topic.confirmation.title'), t('admin-topics-form.delete-topic.confirmation.body'))
      .cancel(t('admin-topics-form.delete-topic.confirmation.cancel'))
      .ok(t('admin-topics-form.delete-topic.confirmation.ok'))
      .modal()
      .closable()
      .effect('slide')
      .show(onconfirmdelete.bind({ topicId: topicId, el: el }));

    function onconfirmdelete(ok) {
      if (!ok) return;
      var view = this;

      request
        .post('/api/topic/' + this.topicId + '/delete')
        .end(function (err, res) {
          if (err || !res.ok) return log('Found error %o', err || res.error);
          o(view.el).addClass('hide');
        });
    }
  }
}

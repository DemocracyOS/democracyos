/**
 * Module dependencies.
 */

import debug from 'debug'
import t from 't-component'
import template from './template.jade'
import topicStore from '../../stores/topic-store/topic-store'
import List from 'democracyos-list.js'
import moment from 'moment'
import confirm from 'democracyos-confirmation'
import View from '../../view/view'
import urlBuilder from 'lib/url-builder'

const log = debug('democracyos:admin-topics')

/**
 * Creates a list view of topics
 */

export default class TopicsListView extends View {
  constructor (topics, forum = null) {
    super(template, {
      topics: topics.filter((t) => t.privileges.canEdit || t.privileges.canDelete),
      moment,
      forum,
      urlBuilder
    })
  }

  switchOn () {
    this.bind('click', '.btn.delete-topic', this.bound('ondeletetopicclick'))
    this.list = new List('topics-wrapper', { valueNames: ['topic-title', 'topic-id', 'topic-date'] })
  }

  ondeletetopicclick (ev) {
    ev.preventDefault()
    const el = ev.delegateTarget.parentElement
    const topicId = el.getAttribute('data-topicid')
    if(!topicId) debugger

    const _t = (s) => t(`admin-topics-form.delete-topic.confirmation.${s}`)

    const onconfirmdelete = (ok) => {
      if (!ok) return

      topicStore.destroy(topicId)
        .catch((err) => {
          log('Found error %o', err)
        })
    }

    confirm(_t('title'), _t('body'))
      .cancel(_t('cancel'))
      .ok(_t('ok'))
      .modal()
      .closable()
      .effect('slide')
      .show(onconfirmdelete)
  }
}

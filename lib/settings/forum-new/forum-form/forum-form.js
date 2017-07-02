import lock from 'democracyos-loading-lock'
import t from 't-component'
import page from 'page'
import config from '../../../config/config.js'
import FormView from '../../../form-view/form-view.js'
import ForumUnique from '../forum-unique/forum-unique.js'
import template from './template.jade'

export default class ForumForm extends FormView {
  /**
   * ForumForm
   *
   * @return {ForumForm} `ForumForm` instance.
   * @api public
   */

  constructor () {
    super(template, { domain: `${config.protocol}://${config.host}/` })
    this.elUrl = this.find('input[name=name]')
    this.form = this.find('form')
    this.forumUnique = new ForumUnique({ el: this.elUrl })
  }

  switchOn () {
    this.on('success', this.bound('onsuccess'))
    this.forumUnique.on('success', this.bound('onuserchecked'))
  }

  switchOff () {
    this.off('success', this.bound('onsuccess'))
    this.forumUnique.off('success', this.bound('onuserchecked'))
  }

  onuserchecked (res) {
    let container = this.find('.subdomain')
    let message = this.find('.subdomain .name-unavailable')

    if (res.exists) {
      container.addClass('has-error')
      container.removeClass('has-success')
      message.removeClass('hide')
    } else {
      container.removeClass('has-error')
      container.addClass('has-success')
      message.addClass('hide')
    }
  }

  onsuccess (res) {
    window.analytics.track('create forum', { forum: res.body.id })
    page('/')
    setTimeout(() => {
      window.location = '/'
    }, 2000)
  }

  loading () {
    this.disable()
    this.messageTimer = setTimeout(() => {
      this.messages(t('forum.form.create.wait'), 'sending')
      this.spin()
      this.find('a.cancel').addClass('enabled')
    }, 1000)
  }

  spin () {
    var div = this.find('.fieldsets')
    if (!div.length) return
    this.spinTimer = setTimeout(() => {
      this.spinner = lock(div[0], { size: 100 })
      this.spinner.lock()
    }, 500)
  }

  unspin () {
    clearTimeout(this.spinTimer)
    if (!this.spinner) return
    this.spinner.unlock()
  }

  disable () {
    this.disabled = true
    this.form.attr('disabled', true)
    this.find('button').attr('disabled', true)
  }

  enable () {
    this.disabled = false
    this.form.attr('disabled', null)
    this.find('button').attr('disabled', null)
  }
}

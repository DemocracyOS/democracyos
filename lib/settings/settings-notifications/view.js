import debug from 'debug'
import t from 't-component'
import Toggle from 'democracyos-toggle'
import user from '../../user/user.js'
import FormView from '../../form-view/form-view.js'
import template from './template.jade'

let log = debug('democracyos:settings-notifications')

export default class NotificationsView extends FormView {
  /**
   * Creates a password edit view
   */

  constructor () {
    super(template)
    this.appendToggles()
  }

  /**
   * Turn on event bindings
   */

  switchOn () {
    this.on('success', this.onsuccess.bind(this))
  }

  /**
   * Turn off event bindings
   */

  switchOff () {
    this.off()
  }

  /**
   * Handle `error` event with
   * logging and display
   *
   * @param {String} error
   * @api private
   */

  onsuccess () {
    log('Notification settings updated')
    this.messages([t('Your notifiction settings were successfuly updated')], 'success')
    user.load('me')
  }

  /**
   * Append toggle buttons
   */

  appendToggles () {
    let self = this
    let names = [
      'new-topic',
      'replies',
      'mentions'
    ]
    names.forEach((name) => {
      let toggle = new Toggle()
      toggle.label(t('settings-notifications.yes'), t('settings-notifications.no'))
      toggle.name(name)
      if (user.notifications[name]) toggle.value(true)
      let el = self.el.find('.' + name)
      el.prepend(toggle.el)
    })
  }
}

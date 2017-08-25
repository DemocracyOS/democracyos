import t from 't-component'
import debug from 'debug'
import FormView from '../../form-view/form-view.js'
import template from './template.jade'

let log = debug('democracyos:settings-password')

export default class PasswordView extends FormView {
  /**
   * Creates a password edit view
   */

  constructor () {
    super(template)
  }

  /**
   * Turn on event bindings
   */

  switchOn () {
    this.on('success', this.onsuccess.bind(this))
    this.on('error', this.onerror.bind(this))
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
    log('Password updated')
    this.messages([t('settings.password-updated')], 'success')
  }

  /**
   * Handle current password is incorrect
   */

  onerror (response) {
    console.log('onerror')
    console.log(response.status)
    if (response.status === 403) {
      console.log(t('settings.password-invalid'))
      this.messages([t('settings.password-invalid')])
    }
  }
}

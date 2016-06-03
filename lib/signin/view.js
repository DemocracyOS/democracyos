import page from 'page'
import t from 't-component'
import user from '../user/user.js'
import FormView from '../form-view/form-view.js'
import template from './template.jade'
import config from '../config/config.js'

export default class SigninForm extends FormView {

  constructor () {
    super(template)
  }

  switchOn () {
    this.on('success', this.bound('onsuccess'))
  }

  /**
   * Show success message
   */

  onsuccess () {
    user.load('me')
    window.analytics.track('signin')
    page('/')

    user.once('loaded', function () {
      if (user.locale && user.locale !== config.locale) {
        window.location.reload()
      }
    })
  }

  /**
   * Handle http response to show message to the user.
   *
   * @returns {Mixed}
   * @override from {FormView}
   */

  response (err, res) {
    if (err) {
      return this.errors([err])
    }

    // Redirect if come from unverified email
    // FIXME: this error detection mechanism is a little weird, we should avoid compare keys.
    var text
    try {
      text = JSON.parse(res.text)
    } catch (e) {
      text = ''
    }

    if (res.ok && text && text.error === t('signin.error.email-not-valid')) {
      page('/signup/resend-validation-email')
    }

    if (res.body && res.body.error) {
      return this.errors([t(res.body.error, { email: this.find('[name=email]').val() })])
    }

    this.emit('success', res)
  }
}

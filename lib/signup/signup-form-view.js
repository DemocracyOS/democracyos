import t from 't-component'
import title from '../title/title.js'
import FormView from '../form-view/form-view.js'
import template from './signup-form.jade'

export default class SignupForm extends FormView {

  /**
   * Proposal Comments view
   *
   * @return {SignupForm} `SignupForm` instance.
   * @api public
   */

  constructor (reference) {
    super(template, { reference: reference })
  }

  switchOn () {
    this.on('success', this.bound('showSuccess'))
  }

  /**
   * Show success message
   */

  showSuccess () {
    let form = this.find('#signup-form')
    let success = this.find('#signup-message')
    let welcomeMessage = this.find('#signup-message h1')
    let firstName = this.get('firstName')
    let lastName = this.get('lastName')
    let email = this.get('email')
    let fullname = firstName + ' ' + lastName
    let message = t('signup.welcome', { name: fullname })

    window.analytics.track('signup', {
      email,
      firstName,
      lastName
    })

    title(t('signup.complete'))
    welcomeMessage.html(message)
    form.addClass('hide')
    success.removeClass('hide')
  }
}

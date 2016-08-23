import title from '../../title/title.js'
import t from 't-component'
import FormView from '../../form-view/form-view.js'
import template from './resend-validation-email-form.jade'

export default class ResendValidationEmailForm extends FormView {

  /**
   * Proposal Comments view
   *
   * @return {ResendValidationEmailForm} `ResendValidationEmailForm` instance.
   * @api public
   */

  constructor () {
    super(template)
    this.errors([t('resend-validation-email-form.error.email-not-valid.no-link')])
  }

  switchOn () {
    this.on('success', this.bound('showSuccess'))
  }

  /**
   * Show success message
   */

  showSuccess () {
    let form = this.find('#resend-form')
    let success = this.find('#resend-message')
    title(t('signup.resend-validation-email-complete'))
    form.addClass('hide')
    success.removeClass('hide')
  }
}

import page from 'page'
import FormView from '../form-view/form-view.js'
import template from './email-validation.jade'
import submit from '../submit'

export default class EmailValidationForm extends FormView {

  /**
   * Email Validation Form View
   *
   * @return {EmailValidationForm} `EmailValidationForm` instance.
   * @api public
   */

  constructor (token, reference) {
    super(template, { token: token })
    this.reference = reference
    this.form = this.find('form')[0]

    submit(this.form)
  }

  switchOn () {
    this.on('success', this.bound('onsuccess'))
  }

  /**
   * Show success message
   */

  onsuccess () {
    let url = '/signup/validated'
    url += this.reference ? '?reference=' + this.reference : ''
    page(url)
  }
}

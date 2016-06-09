import View from '../view/view.js'
import template from './email-validation-complete.jade'

export default class EmailValidationCompleteForm extends View {

  /**
   * Email Validation Form View
   *
   * @return {EmailValidationCompleteForm} `EmailValidationCompleteForm` instance.
   * @api public
   */

  constructor (reference) {
    super(template, { reference: reference })
  }
}

import page from 'page';
import t from 't-component';
import FormView from '../form-view/form-view.js';
import template from './email-validation.jade';

// TODO: Make a separate module
// Based on https://github.com/segmentio/submit-form
let submit = (form) => {
  let button = document.createElement('button');
  button.style.display = 'none';

  let e = document.createEvent('MouseEvent');
  e.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);

  form.appendChild(button);
  button.dispatchEvent ? button.dispatchEvent(e) : button.fireEvent('onclick', e);
  form.removeChild(button);
};

export default class EmailValidationForm extends FormView {

  /**
   * Email Validation Form View
   *
   * @return {EmailValidationForm} `EmailValidationForm` instance.
   * @api public
   */

  constructor (token, reference) {
    super(template, { token: token });
    this.reference = reference;
    this.form = this.find('form')[0];

    submit(this.form);
  }

  switchOn () {
    this.on('success', this.bound('onsuccess'));
  }

  /**
   * Show success message
   */

  onsuccess () {
    let url = '/signup/validated';
    url += this.reference ? '?reference=' + this.reference : '';
    page(url);
  }
}

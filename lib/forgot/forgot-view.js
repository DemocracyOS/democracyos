import page from 'page';
import t from 't-component';
import FormView from '../form-view/form-view.js';
import template from './forgot-form.jade';

export default class ForgotView extends FormView {

  /**
   * Forgot password view
   *
   * @return {ForgotView} `ForgotView` instance.
   * @api public
   */

  constructor () {
    super(template);
  }

  switchOn () {
    this.on('success', this.bound('onsuccess'));
    this.on('error', this.bound('onerror'));
  }

  /**
   * Show success message
   */

  onsuccess () {
    let form = this.find('form');
    let explanation = this.find('p.explanation-message');
    let success = this.find('p.success-message');

    form.addClass('hide');
    explanation.addClass('hide');
    success.removeClass('hide');
  }

  /**
   * Handle errors
   */

  onerror (error) {
    if ('notvalidated' === error.status) {
      page('/signup/resend-validation-email');
    }
  }
}

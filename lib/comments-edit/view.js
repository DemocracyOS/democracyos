import FormView from '../form-view/form-view.js';
import template from './template.jade';

export default class CommentsEditView extends FormView {
  constructor (comment) {
    super(template, { comment: comment });
    this.comment = comment;
  }

  /**
   * Switch on events
   *
   * @api public
   */

  switchOn () {
    this.bind('click', '.btn-cancel', 'oncancel');
    this.bind('keydown', 'textarea', 'onkeydown');
    this.on('success', this.bound('onsuccess'));
  }

  /**
   * Submit if meta key is pressed
   *
   * @param  {Event} ev keydown event
   */

  onkeydown (ev) {
    if (ev.keyCode == 13 && (ev.metaKey || ev.ctrlKey)) {
      this.el.find('.form-submit')[0].click();
    }
  }

  /**
   * Put a comment
   *
   * @param {Object} data
   * @api public
   */

  onsuccess (res) {
    this.emit('put', res.body);
  }

  /**
   * On cancel editing a comment
   *
   * @param {Object} data
   * @api public
   */

   oncancel (ev) {
    ev.preventDefault();
    this.el.removeClass('edit');
    this.remove();
  }
}

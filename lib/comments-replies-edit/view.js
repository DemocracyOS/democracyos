import debug from 'debug';
import FormView from '../form-view/form-view.js';
import template from './template.jade';
import submit from '../submit';

let log = debug('democracyos:comments-replies-edit');

export default class CommentsRepliesEditView extends FormView {

  /**
   * View constructor
   *
   * @param {Comment} comment
   * @constructor
   */

  constructor (comment, reply) {
    super(template, { comment: comment, reply: reply });
    this.comment = comment;
    this.reply = reply;
    this.form = this.find('form')[0];
  }

  /**
   * Switch on events
   *
   * @api public
   */

  switchOn () {
    this.bind('click', 'form.reply-edit-form .btn-cancel', 'oncancel');
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
      submit(this.form);
    }
  }

  /**
   * Put a comment
   *
   * @param {Object} data
   * @api public
   */

  onsuccess (res) {
    this.emit('put', { data: res.body, el: this.el[0] });
  }

  /**
   * On cancel editing a comment
   *
   * @param {Object} data
   * @api public
   */

   oncancel (ev) {
    ev.preventDefault();
    this.emit('cancel', this.el[0]);
    this.remove();
  }
}

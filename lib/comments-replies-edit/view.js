import debug from 'debug';
import FormView from '../form-view/form-view.js';
import template from './template.jade';

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
  }

  /**
   * Switch on events
   *
   * @api public
   */

  switchOn () {
    this.bind('click', 'form.reply-edit-form .btn-cancel', 'oncancel');
    this.on('success', this.bound('onsuccess'));
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

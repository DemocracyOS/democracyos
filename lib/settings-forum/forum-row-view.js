import debug from 'debug';
import o from 'dom';
import View from '../view/view.js';
import template from './forum-row.jade';
import DeleteForumModal from './delete-modal-view.js';

let log = debug('democracyos:settings-forum');

export default class ForumRowView extends View {

  /**
   * Creates a profile edit view
   */

  constructor (forum) {
    super(template, { forum: forum });
    this.forum = forum;
    this.renderStatus();
  }

  switchOn () {
    this.forum.on('status:change', this.bound('renderStatus'));
    this.bind('click', '.btn-remove', this.bound('remove'));
  }

  switchOff () {
    this.forum.off('status:change', this.bound('renderStatus'));
    this.unbind();
  }

  remove () {
    let modal = new DeleteForumModal(this.forum);
    modal.on('deleted', () => this.emit('change'));
  }

  renderStatus () {
    let el = o(this.el[0]);
    el
      .removeClass(/^status-/)
      .addClass('status-' + this.forum.status());
  }
}

import View from '../view/view.js';
import template from './forum-row.jade';
// import DeleteForumModal from './delete-modal-view.js';

export default class ForumRowView extends View {

  /**
   * Creates a profile edit view
   */

  constructor (forum) {
    super(template, { forum: forum });
    this.forum = forum;
  }

  switchOn () {
    this.bind('click', '.btn-remove', this.bound('remove'));
  }

  switchOff () {
    this.unbind();
  }

  remove () {
    console.log('Delete not implemented, see https://github.com/DemocracyOS/app/issues/946.');
    // return new DeleteForumModal(this.forum);
  }
}

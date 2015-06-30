import render from '../render/render';
import View from '../view/view';
import ForumRow from './forum-row-view';
import template from './template.jade';
import newForumButton from './new-forum-button.jade';
import forumStore from '../forum-store/forum-store';
import Log from 'debug';

const log = new Log('democracyos:settings-forum:view');

export default class ForumsView extends View {

  /**
   * Creates a profile edit view
   */

  constructor () {
    super(template);

    this.forumsList = this.find('.forums');

    this.load();
  }

  load () {
    forumStore.getUserForum()
      .then(forum => this.add(forum))
      .catch(err => {
        if (err.message === 'Not found') {
          this.empty();
        } else {
          log('Found Error %s', err);
        }
      })
    ;
  }

  add (forum) {
    var row = new ForumRow(forum);
    this.forumsList.append(row.el);
  }

  empty () {
    this.forumsList.empty();
    this.forumsList.append(render(newForumButton));
  }
}

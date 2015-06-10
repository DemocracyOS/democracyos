import render from '../render/render';
import View from '../view/view';
import ForumRow from './forum-row-view';
import template from './template.jade';
import newForumButton from './new-forum-button.jade';
import userForum from '../forum-model/user-forum';

export default class ForumsView extends View {

  /**
   * Creates a profile edit view
   */

  constructor () {
    super(template);
    this.load();
  }

  load () {
    let forums = this.find('.forums');

    userForum.load()
      .then(() => {
        if (userForum.exists()) {
          var row = new ForumRow(userForum);
          row.on('change', this.load.bind(this));
          forums.append(row.el);
        } else {
          forums.append(render(newForumButton));
        }
      })
    ;
  }
}

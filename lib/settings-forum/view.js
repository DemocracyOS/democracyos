import render from '../render/render';
import View from '../view/view';
import ForumRow from './forum-row-view';
import template from './template.jade';
import button from './new-forum-button.jade';
import forum from '../forum-model/forum-model';

export default class ForumsView extends View {

  /**
   * Creates a profile edit view
   */

  constructor () {
    super(template);
    this.load();
  }

  load () {
    var self = this;
    forum
      .onLoaded(() => {
        if (forum.status() === 'non-existent') {
          self.find('.forums').append(render(button));
        } else {
          var row = new ForumRow(forum);
          row.on('change', this.load.bind(this));
          self.find('.forums').append(row.el);
        }
      })
      .fetch();
  }
}

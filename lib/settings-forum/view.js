import page from 'page';
import debug from 'debug';
import render from '../render/render.js';
import View from '../view/view.js';
import ForumRow from './forum-row-view.js';
import template from './template.jade';
import button from './new-forum-button.jade';
import forum from '../forum-model/forum-model.js';

let log = debug('democracyos:settings-forums');

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

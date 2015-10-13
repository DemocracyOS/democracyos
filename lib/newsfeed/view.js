import View from '../view/view';
import loading from 'democracyos-loading-lock';
import template from './template.jade';
import { dom } from '../render/render';
import buttonTemplate from './forum-button.jade';
import forumStore from '../forum-store/forum-store';
import Log from 'debug';

const log = new Log('democracyos:newsfeed');

export default class Newsfeed extends View {
  constructor() {
    super(template);
    this.page = 0;
    this.loading = this.find('.loading-container');
    this.start = this.find('.newsfeed.start');
    this.createButton();
  }

  switchOn() {
    this.bind('click', '.load-more', this.bound('fill'));
  }

  createButton() {
    let render = forum => {
      let button = dom(buttonTemplate, { forum: forum });
      this.start.append(button);
      return forum;
    };

    forumStore.findUserForum()
      .then(render)
      .catch(err => {
        if (404 === err.status) render();
        else if (403 === err.status) render();
        else log('Found error %s', err);
      });
  }
}

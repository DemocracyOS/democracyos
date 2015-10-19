import View from '../view/view';
import loading from 'democracyos-loading-lock';
import template from './template.jade';
import { dom } from '../render/render';
import buttonTemplate from './forum-button.jade';
import forumStore from '../forum-store/forum-store';
import Log from 'debug';
import ForumCard from './forum-card';

const log = new Log('democracyos:newsfeed');

export default class Newsfeed extends View {
  constructor(forums) {
    super(template);
    this.page = 0;
    this.forums = forums;
    this.loading = this.find('.loading-container');
    this.start = this.find('.newsfeed.start');
    this.createButton();
    this.fill();
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

  fill() {
    for (var i in this.forums) {
      const forumCard = new ForumCard(this.forums[i]);
      forumCard.appendTo(this.find('.forums')[0]);
    }
  }
}

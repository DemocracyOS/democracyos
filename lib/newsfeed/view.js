import view from '../view/mixin';
import template from './template.jade';
import { domRender } from '../render/render';
import buttonTemplate from './forum-button.jade';
import forumStore from '../forum-store/forum-store';
import Log from 'debug';
import ForumCard from './forum-card/forum-card.js';

const log = new Log('democracyos:newsfeed');

export default class Newsfeed extends view('appendable') {
  constructor(options = {}) {
    options.template = template;
    super(options);

    this.forums = options.forums;
    this.page = 0;
    this.start = this.el.querySelector('.newsfeed.start');

    this.createButton();
    this.fill();
  }

  createButton() {
    let render = forum => {
      let button = domRender(buttonTemplate, { forum: forum });
      this.start.appendChild(button);
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
    if (!(this.forums && this.forums.length)) return;

    let fragment = document.createDocumentFragment();

    this.forums.forEach(forum => {
      new ForumCard({
        forum: forum,
        container: fragment
      });
    });

    this.el.querySelector('.forums').appendChild(fragment);
  }
}

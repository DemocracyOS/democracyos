import Log from 'debug';
import view from '../view/mixin';
import template from './template.jade';
import { domRender } from '../render/render';
import forumInfoTemplate from './forum-info.jade';
import forumStore from '../forum-store/forum-store';
import ForumCard from './forum-card/forum-card';

const log = new Log('democracyos:newsfeed');

export default class Newsfeed extends view('appendable', 'withEvents') {
  constructor (options = {}) {
    options.template = template;
    super(options);

    this.forums = options.forums;
    this.page = 0;
    this.loadingPage = false;

    this.add(this.forums);
    this.initPagination();
    this.loadForumInfo();
  }

  initPagination () {
    this.pagination = this.el.querySelector('[data-pagination]');
    this.bind('click', '[data-pagination] button', this.onLoadPage.bind(this));
  }

  onLoadPage () {
    if (this.loadingPage) return;

    this.loadingPage = true;
    this.pagination.classList.add('loading');

    forumStore.findAll({
      page: ++this.page
    }).then(forums => {
      this.pagination.classList.remove('loading');
      if (forums.length) {
        this.add(forums);
      } else {
        this.pagination.classList.add('empty');
        this.pagination.classList.add('hide');
      }
      this.loadingPage = false;
    }).catch(err => {
      log('Found error %s', err);
      this.page--;
      this.pagination.classList.remove('loading');
      this.loadingPage = false;
    });
  }

  loadForumInfo () {
    let placeholder = this.el.querySelector('[data-forum-info]');

    if (!placeholder) return;

    let render = forum => {
      let info = domRender(forumInfoTemplate, { forum: forum });
      placeholder.parentNode.replaceChild(info, placeholder);
    };

    forumStore.findAll({'privileges.canChangeTopics': true})
      .then(render)
      .catch(err => {
        if (404 === err.status) render();
        else if (403 === err.status) render();
        else log('Found error %s', err);
      });
  }

  add (forums) {
    if (!(forums && forums.length)) return;

    let fragment = document.createDocumentFragment();

    forums.forEach(forum => {
      new ForumCard({
        forum: forum,
        container: fragment
      });
    });

    this.el.querySelector('[data-forums]').appendChild(fragment);
  }
}

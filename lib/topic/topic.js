import o from 'component-dom';
import bus from 'bus';
import debug from 'debug';
import page from 'page';
import urlBuilder from '../url-builder/url-builder';
import title from '../title/title';
import { findTopics, findTopic } from '../topic-middlewares/topic-middlewares';
import sidebar from '../sidebar/sidebar';
import user from '../user/user';
import Article from '../proposal-article/proposal-article';
import Options from '../proposal-options/proposal-options';
import Comments from '../comments-view/view';
import locker from '../browser-lock/locker';
import forumRouter from '../forum-router/forum-router.js';

const log = debug('democracyos:topic:page');

export function show (topic) {
  analytics.track('view topic', { topic: topic.id });
  bus.emit('page:render', topic.id);

  const appContent = o('section.app-content');

  sidebar.select(topic.id);

  // Clean page's content
  o('#content').empty();
  appContent.empty();

  // Build article's content container
  // and render to section.app-content
  let article = new Article(topic);
  article.appendTo(appContent);

  // Build article's meta
  // and render to section.app-content
  let options = new Options(topic);
  options.appendTo(appContent);

  // Build article's comments, feth them
  // and render to section.app-content
  let comments = new Comments(topic);
  comments.appendTo(appContent);
  comments.initialize();

  o(document.body).addClass('browser-page');

  bus.once('page:change', pagechange);
  function pagechange(url) {
    // restore page's original title
    title();

    // lock article's section
    locker.lock();

    // hide it from user
    appContent.addClass('hide');

    // once render, unlock and show
    bus.once('page:render', function() {
      locker.unlock();
      appContent.removeClass('hide');
    });

    // scroll to top
    o('section#browser').scrollTop = 0;

    o(document.body).removeClass('browser-page');
  }
}

page(forumRouter('/topic/:id'), user.optional, findTopics, findTopic, (ctx, next) => {
  log(`rendering Topic ${ctx.params.id}`);

  if (!ctx.topic) {
    log('Topic %s not found', ctx.params.id);
    return next();
  }

  show(ctx.topic);

  title(ctx.topic.mediaTitle);

  log('render %s', ctx.params.id);
});

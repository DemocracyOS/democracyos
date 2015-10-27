import o from 'component-dom';
import bus from 'bus';
import debug from 'debug';
import page from 'page';
import urlBuilder from '../url-builder/url-builder';
import title from '../title/title';
import { findTopics, findTopic } from '../topic-middlewares/topic-middlewares';
import { findForum } from '../forum-middlewares/forum-middlewares';
import sidebar from '../sidebar/sidebar';
import user from '../user/user';
import Article from '../proposal-article/proposal-article';
import Options from '../proposal-options/proposal-options';
import Comments from '../comments-view/view';
import locker from '../browser-lock/locker';
import forumRouter from '../forum-router/forum-router.js';

const log = debug('democracyos:topic:page');

page(forumRouter('/topic/:id'), user.optional, findForum, findTopics, findTopic, (ctx, next) => {
  analytics.track('view topic', { topic: ctx.topic.id });
  bus.emit('page:render', ctx.topic.id);
  log(`rendering Topic ${ctx.params.id}`);

  if (!ctx.topic) {
    log('Topic %s not found', ctx.params.id);
    return next();
  }

  const appContent = o('section.app-content');

  sidebar.select(ctx.topic.id);

  // Clean page's content
  o('#content').empty();
  appContent.empty();

  // Build article's content container
  // and render to section.app-content
  let article = new Article(ctx.topic, ctx.path);
  article.appendTo(appContent);

  // Build article's meta
  // and render to section.app-content
  let options = new Options(ctx.topic, ctx.path);
  options.appendTo(appContent);

  // Build article's comments, feth them
  // and render to section.app-content
  let comments = new Comments(ctx.topic, ctx.path);
  comments.appendTo(appContent);
  comments.initialize();

  o(document.body).addClass('browser-page');

  if (ctx.canonicalPath !== ctx.path) {
    title();
  } else {
    title(ctx.topic.mediaTitle);
  }

  log('render %s', ctx.params.id);

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

    // check if loading to same page
    // and if not, scroll to top
    if (url !== ctx.path) o('section#browser').scrollTop = 0;

    // don't remove 'browser-page' body class
    // if we still are in a browsing topics page
    let onTopics = new RegExp(`^${urlBuilder.topic({id: ''}, ctx.forum)}`);
    if (onTopics.test(url)) return;
    o(document.body).removeClass('browser-page');
  }
});

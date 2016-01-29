import dom from 'component-dom';
import bus from 'bus';
import debug from 'debug';
import page from 'page';
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

export function show (topic, forum) {
  window.analytics.track('view topic', {topic: topic.id});
  bus.emit('page:render', topic.id);

  sidebar.select(topic.id);
  const appContent = dom('section.app-content');

  // Clean page's content
  dom('#content').empty();
  appContent.empty();

  // Build article's content container
  // and render to section.app-content
  let article = new Article(topic);
  article.appendTo(appContent);

  // Build article's meta
  // and render to section.app-content
  if (topic.votable) {
    let options = new Options({
      proposal: topic,
      canVote: forum && forum.privileges ? forum.privileges.canVote : true
    });
    options.appendTo(appContent);
  }

  // Build article's comments, feth them
  // and render to section.app-content
  let comments = new Comments(topic);
  comments.appendTo(appContent);
  comments.initialize();

  document.body.classList.add('browser-page');
}

export function exit() {
  title();

  // lock article's section
  locker.lock();

  const appContent = dom('section.app-content');

  // hide it from user
  appContent.addClass('hide');

  // once render, unlock and show
  bus.once('page:render', function() {
    locker.unlock();
    appContent.removeClass('hide');
  });

  // scroll to top
  dom('section#browser').scrollTop = 0;

  document.body.classList.remove('browser-page');
}

page(forumRouter('/topic/:id'), user.optional, findTopics, findTopic, (ctx, next) => {
  log(`rendering Topic ${ctx.params.id}`);

  if (!ctx.topic) {
    log('Topic %s not found', ctx.params.id);
    return next();
  }

  show(ctx.topic, ctx.forum);

  title(ctx.topic.mediaTitle);

  log('render %s', ctx.params.id);
});

page.exit(forumRouter('/topic/:id'), (ctx, next) => {
  exit();
  next();
});

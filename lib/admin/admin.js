/**
 * Module dependencies.
 */

import bus from 'bus';
import config from '../config/config';
import template from './admin-container.jade';
import Sidebar from '../admin-sidebar/admin-sidebar';
import TopicsListView from '../admin-topics/view';
import TopicForm from '../admin-topics-form/view';
import user from '../user/user';
import { dom as render } from '../render/render';
import title from '../title/title';
import topicStore from '../topic-store/topic-store';
import page from 'page';
import o from 'component-dom';
import forumRouter from '../forum-router/forum-router';
import urlBuilder from '../url-builder/url-builder';
import { findForum } from '../forum-middlewares/forum-middlewares';
import { findPrivateTopics, findTopic } from '../topic-middlewares/topic-middlewares';

page(forumRouter('/admin/*'),
  valid,
  findForum,
  user.required,
  user.hasAccessToForumAdmin,
  (ctx, next) => {
    let section = ctx.section;
    let container = render(template);

    // prepare wrapper and container
    o('#content').empty().append(container);

    // set active section on sidebar
    ctx.sidebar = new Sidebar(ctx.forum);
    ctx.sidebar.set(section);
    ctx.sidebar.appendTo(o('.sidebar-container', container)[0]);

    // Set page's title
    title();

    // if all good, then jump to section route handler
    next();
  }
);

page(forumRouter('/admin'), findForum, ctx => {
  page.redirect(urlBuilder.admin(ctx.forum) + '/topics');
});

page(forumRouter('/admin/topics'), findPrivateTopics, ctx => {
  let currentPath = ctx.path;
  let topicsList = new TopicsListView(ctx.topics, ctx.forum);
  topicsList.replace('.admin-content');
  ctx.sidebar.set('topics');

  const onTopicsUpdate = () => { page(currentPath); };
  bus.once('topic-store:update:all', onTopicsUpdate);
  bus.once('page:change', () => {
    bus.off('topic-store:update:all', onTopicsUpdate);
  });
});

page(forumRouter('/admin/topics/create'), ctx => {
  ctx.sidebar.set('topics');
  // render new topic form
  let form = new TopicForm(null, ctx.forum);
  form.replace('.admin-content');
  form.once('success', function() {
    topicStore.findAll();
  });
});

page(forumRouter('/admin/topics/:id'), findTopic, ctx => {
  // force section for edit
  // as part of list
  ctx.sidebar.set('topics');

  // render topic form for edition
  let form = new TopicForm(ctx.topic, ctx.forum);
  form.replace('.admin-content');
  form.on('success', function() {
    topicStore.findAll();
  });
});

/**
 * Check if page is valid
 */

function valid(ctx, next) {
  let section = ctx.section = ctx.params[0];
  if (/topics|users/.test(section)) return next();
  if (/topics|users\/create/.test(section)) return next();
  if (/topics|users\/[a-z0-9]{24}\/?$/.test(section)) return next();
}

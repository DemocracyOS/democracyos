import bus from 'bus';
import config from '../config/config';
import template from './admin-container.jade';
import Sidebar from '../admin-sidebar/admin-sidebar';
import TopicsListView from '../admin-topics/view';
import TopicForm from '../admin-topics-form/view';
import TagsList from '../admin-tags/view';
import TagForm from '../admin-tags-form/view';
import user from '../user/user';
import { domRender } from '../render/render';
import title from '../title/title';
import topicStore from '../topic-store/topic-store';
import page from 'page';
import dom from 'component-dom';
import forumRouter from '../forum-router/forum-router';
import urlBuilder from '../url-builder/url-builder';
import AdminPermissions from '../admin-permissions/admin-permissions';
import { findPrivateTopics,
         findTopic } from '../topic-middlewares/topic-middlewares';
import { findAllTags,
         findTag,
         clearTagStore } from '../tag-middlewares/tag-middlewares';

page(forumRouter('/admin/*'),
  valid,
  user.required,
  user.hasAccessToForumAdmin,
  (ctx, next) => {
    let section = ctx.section;
    let container = domRender(template);

    // prepare wrapper and container
    dom('#content').empty().append(container);

    // set active section on sidebar
    ctx.sidebar = new Sidebar(ctx.forum);
    ctx.sidebar.set(section);
    ctx.sidebar.appendTo(dom('.sidebar-container', container)[0]);

    // Set page's title
    title();

    // if all good, then jump to section route handler
    next();
  }
);

page(forumRouter('/admin'), ctx => {
  page.redirect(urlBuilder.admin(ctx.forum) + '/topics');
});

page(forumRouter('/admin/topics'), findPrivateTopics, ctx => {
  let currentPath = ctx.path;
  let topicsList = new TopicsListView(ctx.topics, ctx.forum);
  topicsList.replace('.admin-content');
  ctx.sidebar.set('topics');

  ctx.onTopicsUpdate = () => { page(currentPath); };
  bus.once('topic-store:update:all', ctx.onTopicsUpdate);
});

page.exit(forumRouter('/admin/topics'), (ctx, next) => {
  bus.off('topic-store:update:all', ctx.onTopicsUpdate);
  next();
});

page(forumRouter('/admin/topics/create'), clearTagStore, findAllTags, ctx => {
  ctx.sidebar.set('topics');
  // render new topic form
  let form = new TopicForm(null, ctx.forum, ctx.tags);
  form.replace('.admin-content');
  form.once('success', function() {
    topicStore.findAll();
  });
});

page(forumRouter('/admin/topics/:id'), clearTagStore, findAllTags, findTopic, ctx => {
  // force section for edit
  // as part of list
  ctx.sidebar.set('topics');

  // render topic form for edition
  let form = new TopicForm(ctx.topic, ctx.forum, ctx.tags);
  form.replace('.admin-content');
  form.on('success', function() {
    topicStore.findAll();
  });
});

page(forumRouter('/admin/tags'), clearTagStore, findAllTags, ctx => {
  const tagsList = new TagsList({
    forum: ctx.forum,
    tags: ctx.tags
  });

  tagsList.replace('.admin-content');
  ctx.sidebar.set('tags');
});

page(forumRouter('/admin/tags/create'), ctx => {
  let form = new TagForm();
  form.replace('.admin-content');
  ctx.sidebar.set('tags');
});

page(forumRouter('/admin/tags/:id'), findTag, ctx => {
  // force section for edit
  // as part of list
  ctx.sidebar.set('tags');

  // render topic form for edition
  let form = new TagForm(ctx.tag);
  form.replace('.admin-content');
});

page(forumRouter('/admin/permissions'), ctx => {
  let content = document.querySelector('.admin-content');

  let view = new AdminPermissions({
    container: content
  });

  ctx.sidebar.set('permissions');
});

if (config.usersWhitelist) {
  require('../admin-whitelists/admin-whitelists');
  require('../admin-whitelists-form/admin-whitelists-form');
}

/**
 * Check if page is valid
 */

function valid(ctx, next) {
  let section = ctx.section = ctx.params[0];
  if (/topics|tags|permissions/.test(section)) return next();
  if (/users|users\/create/.test(section)) return next();
}

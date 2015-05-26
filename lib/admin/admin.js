/**
 * Module dependencies.
 */

import config from '../config/config.js';
import template from './admin-container.jade';
import sidebar from '../admin-sidebar/index.js';
import TopicsList from '../admin-topics/view.js';
import TopicForm from '../admin-topics-form/view.js';
import TagsList from '../admin-tags/view.js';
import TagForm from '../admin-tags-form/view.js';
import classes from 'classes';
import citizen from '../citizen/citizen.js';
import request from '../request/request.js';
import { dom as render } from '../render/render.js';
import title from '../title/title.js';
import empty from 'empty';
import topics from '../topics/topics.js';
import tags from '../tags/tags.js';
import page from 'page';
import o from 'component-dom';
import debug from 'debug'

let log = debug('democracyos:admin');

page("/admin/:section(*)?", valid, citizen.required, citizen.isStaff, (ctx, next) => {
  let section = ctx.params.section;
  let container = render(template);

  // prepare wrapper and container
  o('#content').empty().append(container);

  // set active section on sidebar
  sidebar.set(section);
  sidebar.appendTo(o('.sidebar-container', container)[0]);

  // Set page's title
  title();

  // if all good, then jump to section route handler
  next();
});

page('/admin/topics', topics.middleware, (ctx, next) => {
  let topicsList = new TopicsList();
  topicsList.replace('.admin-content');
  sidebar.set('topics');
});

page('/admin/topics/create', tags.middleware, (ctx, next) => {
  sidebar.set('topics');
  // render new topic form
  let form = new TopicForm();
  form.replace('.admin-content');
  form.once('success', function(data) {
    topics.fetch();
  });
});

page('/admin/topics/:id', tags.middleware, loadTopic, (ctx, next) => {
  // force section for edit
  // as part of list
  sidebar.set('topics');

  // render topic form for edition
  let form = new TopicForm(ctx.topic);
  form.replace('.admin-content');
  form.on('success', function() {
    topics.fetch();
  });
});

page('/admin/tags', tags.middleware, (ctx, next) => {
  let tagsList = new TagsList();
  tagsList.replace('.admin-content');
  sidebar.set('tags');
});

page('/admin/tags/create', (ctx, next) => {
  let form = new TagForm();
  form.replace('.admin-content');
  sidebar.set('tags');
});

page('/admin/tags/:id', loadTag, (ctx, next) => {
  // force section for edit
  // as part of list
  sidebar.set('tags');

  // render topic form for edition
  let form = new TagForm(ctx.tag);
  form.replace('.admin-content');
});

if (config.usersWhitelist) {
  require('../admin-whitelists/admin-whitelists.js');
  require('../admin-whitelists-form/admin-whitelists-form.js');
}

/**
 * Check if page is valid
 */

function valid(ctx, next) {
  // fix path for next matching handlers
  if (/^\/admin$/.test(ctx.path)) ctx.path = ctx.path + '/topics';
  if (/^\/admin\/$/.test(ctx.path)) ctx.path = ctx.path + 'topics';

  // test valid section
  let section = ctx.params.section = ctx.params.section || "topics";
  if (/topics|tags|users/.test(section)) return next();
  if (/topics|tags|users\/create/.test(section)) return next();
  if (/topics|tags|users\/[a-z0-9]{24}\/?$/.test(section)) return next();
}

/**
 * Load specific topic from context params
 */

function loadTopic(ctx, next) {
  request
  .get('/api/topic/' + ctx.params.id)
  .end((err, res) => {
    if (err || !res.ok) {
      let message = 'Unable to load topic for ' + ctx.params.id;
      return log(message);
    };

    ctx.topic = res.body;
    return next();
  });
}

/**
 * Load specific tag from context params
 */

function loadTag(ctx, next) {
  request
  .get('/api/tag/' + ctx.params.id)
  .end((err, res) => {
    if (err || !res.ok) {
      let message = 'Unable to load tag for ' + ctx.params.id;
      return log(message);
    };

    ctx.tag = res.body;
    return next();
  });
}

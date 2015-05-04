/**
 * Module dependencies.
 */

import config from '../config/config.js';
import template from './admin-container.jade';
import sidebar from '../admin-sidebar/index.js';
import LawsList from '../admin-laws/view.js';
import LawForm from '../admin-laws-form/view.js';
import TagsList from '../admin-tags/view.js';
import TagForm from '../admin-tags-form/view.js';
import classes from 'classes';
import citizen from '../citizen/citizen.js';
import request from '../request/request.js';
import render from '../render/render.js';
import title from '../title/title.js';
import empty from 'empty';
import laws from '../laws/laws.js';
import tags from '../tags/tags.js';
import page from 'page';
import o from 'query';
import debug from 'debug'

let log = debug('democracyos:admin');

page("/admin/:section(*)?", valid, citizen.required, citizen.isStaff, (ctx, next) => {
  let section = ctx.params.section;
  let container = render.dom(template);
  let content = o('.admin-content', container);

  // prepare wrapper and container
  empty(o('#content')).appendChild(container);

  // set active section on sidebar
  sidebar.set(section);
  sidebar.appendTo(o('.sidebar-container', container));

  // Set page's title
  title();

  // if all good, then jump to section route handler
  next();
});

page('/admin/laws', laws.middleware, (ctx, next) => {
  let lawsList = new LawsList();
  lawsList.replace('.admin-content');
  sidebar.set('laws');
});

page('/admin/laws/create', tags.middleware, (ctx, next) => {
  let content = o('.admin-content');
  sidebar.set('laws');

  // render new law form
  let form = new LawForm();
  form.replace('.admin-content');
  form.once('success', function(data) {
    laws.fetch();
  });
});

page('/admin/laws/:id', tags.middleware, loadLaw, (ctx, next) => {
  // force section for edit
  // as part of list
  sidebar.set('laws');

  // render law form for edition
  let form = new LawForm(ctx.law);
  form.replace('.admin-content');
  form.on('success', function() {
    laws.fetch();
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

  // render law form for edition
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
  if (/^\/admin$/.test(ctx.path)) ctx.path = ctx.path + '/laws';
  if (/^\/admin\/$/.test(ctx.path)) ctx.path = ctx.path + 'laws';

  // test valid section
  let section = ctx.params.section = ctx.params.section || "laws";
  if (/laws|tags|users/.test(section)) return next();
  if (/laws|tags|users\/create/.test(section)) return next();
  if (/laws|tags|users\/[a-z0-9]{24}\/?$/.test(section)) return next();
}

/**
 * Load specific law from context params
 */

function loadLaw(ctx, next) {
  request
  .get('/api/law/' + ctx.params.id)
  .end((err, res) => {
    if (err || !res.ok) {
      let message = 'Unable to load law for ' + ctx.params.id;
      return log(message);
    };

    ctx.law = res.body;
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

/**
 * Module dependencies.
 */

import title from 'title';
import o from 'component-dom';
import bus from 'bus';
import debug from 'debug';
import page from 'page';
import request from '../request/request.js';
import citizen from '../citizen/citizen.js';
import Article from '../proposal-article/proposal-article.js';
import Options from '../proposal-options/proposal-options.js';
import Comments from '../comments-view/view.js';
import sidebar from '../sidebar/main.js';
import filter from '../laws-filter/laws-filter.js';
import locker from '../browser-lock/locker.js';

let log = debug('democracyos:law:page');

page('/law/:id', citizen.optional, load, (ctx, next) => {
  let validUrl = () => {
    let pathname = window.location.pathname;
    return pathname === '/' ||  /^\/(law|proposal)/.test(pathname);
  };

  if (!validUrl()) return o(document.body).removeClass('browser-page');

  bus.emit('page:render', ctx.law);

  if (!ctx.law) {
    log('Law %s not found', ctx.params.id);
    return next();
  }

  // Render sidebar list
  sidebar.ready(() => {
    let select = () => {
      log('select sidebar law %s', ctx.law.id);
      return setTimeout(sidebar.select.bind(sidebar, ctx.law.id), 0);
    }

    select() && filter.on('reload', select);
  });

  // Clean page's content
  o('section.app-content').empty();

  // Build article's content container
  // and render to section.app-content
  let article = new Article(ctx.law);
  article.appendTo('section.app-content');

  // Build article's meta
  // and render to section.app-content
  let options = new Options(ctx.law);
  options.appendTo('section.app-content');

  // Build article's comments, feth them
  // and render to section.app-content
  let comments = new Comments(ctx.law);
  comments.appendTo('section.app-content');
  comments.initialize();

  o(document.body).addClass('browser-page');
  title(ctx.law.mediaTitle);

  log('render %s', ctx.params.id);

  bus.once('page:change', pagechange);
  function pagechange(url) {
    // restore page's original title
    title();

    // lock article's section
    locker.lock();

    // hide it from user
    o('section.app-content').addClass('hide');

    // once render, unlock and show
    bus.once('page:render', function() {
      locker.unlock();
      o('section.app-content').removeClass('hide');
    });

    // check if loading to same page
    // and if not, scroll to top
    if (url !== ctx.path) o('section#browser').scrollTop = 0;

    // don't remove 'browser-page' body class
    // if we still are in a browsing laws page
    if (/^\/$/.test(url)) return;
    if (/^\/(law|proposal)/.test(url)) return;
    o(document.body).removeClass('browser-page');
  };
});

/*
 * Load homepage data
 *
 * @param {Object} ctx page's context
 * @param {Function} next callback after load
 * @api private
 */

function load (ctx, next) {
  log('fetch for %s', ctx.params.id);

  request
  .get('/api/law/' + ctx.params.id)
  .end(function(err, res) {
    if (res.status == 404) return ctx.law = null, next();
    if (err || !res.ok) return log('Found error: %s', err || res.error);
    ctx.law = res.body;
    next();
  });
};
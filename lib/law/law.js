/**
 * Module dependencies.
 */

var request = require('request');
var citizen = require('citizen');
var empty = require('empty');
var page = require('page');
var List = require('proposal-list');
var Article = require('proposal-article');
var Options = require('proposal-options');
var Comments = require('comments-view');
var sidebar = require('sidebar-list');
var classes = require('classes');
var locker = require('browser-lock');
var o = document.querySelector.bind(document);
var bus = require('bus');
var log = require('debug')('democracyos:law:page');

page('/law/:id', citizen.optional, load, function(ctx, next) {
  bus.emit('page:render');

  // Render sidebar list
  sidebar.render('aside.nav-proposal');
  sidebar.ready(function() {
    sidebar.select(ctx.law.id);
  });

  // Build article's content container
  var article = new Article(ctx.law);

  // Build article's meta
  var options = new Options(ctx.law, ctx.citizen);
  var comments = new Comments('law', ctx.law.id);
  comments.fetch();

  // Render page's content
  empty(o('section.app-content'))
  article.render('section.app-content');
  options.render('section.app-content');
  comments.render('section.app-content');

  classes(document.body).add('browser-page');

  bus.once('page:change', pagechange);

  function pagechange(url) {
    locker.lock();
    classes(o('section.app-content')).add('hide');
    bus.once('page:render', function() {
      locker.unlock();
      classes(o('section.app-content')).remove('hide');
    });
    if (url !== ctx.path) o('section#browser').scrollTop = 0;
    if (/^\/$/.test(url)) return;
    if (/^\/(law|proposal)/.test(url)) return;
    classes(document.body).remove('browser-page');
  }
  log('render %s', ctx.params.id);
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
    if (err || !res.ok) return log('Found error: %s', err || res.error);
    ctx.law = res.body;
    next();
  });
};
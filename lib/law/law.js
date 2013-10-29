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
var config = require('config');
var o = require('query');
var bus = require('bus');
var log = require('debug')('democracyos:law:page');

page('/law/:id', citizen.optional, load, function(ctx, next) {
  bus.emit('page:render');

  // Render sidebar list
  sidebar.render('aside.nav-proposal');
  sidebar.ready(function() {
    sidebar.select(ctx.law.id);
  });

  // Clean page's content
  empty(o('section.app-content'))

  // Build article's content container
  // and render to section.app-content
  var article = new Article(ctx.law);
  article.render('section.app-content');

  // Build article's meta
  // and render to section.app-content
  var options = new Options(ctx.law, ctx.citizen);
  options.render('section.app-content');

  // Build article's comments, feth them
  // and render to section.app-content
  var comments = new Comments('law', ctx.law.id);
  comments.render('section.app-content');
  comments.fetch();

  classes(document.body).add('browser-page');
  title(config['organization name'] + ' - ' + ctx.law.mediaTitle);

  log('render %s', ctx.params.id);

  bus.once('page:change', pagechange);
  function pagechange(url) {
    title(config['organization name']);
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
    if (err || !res.ok) return log('Found error: %s', err || res.error);
    ctx.law = res.body;
    next();
  });
};

/**
 * change head's title
 *
 * @param {String} str
 * @api private
 */

function title(str) {
  o('head title').innerHTML = str;
}
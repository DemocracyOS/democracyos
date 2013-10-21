/**
 * Module dependencies.
 */

var request = require('superagent');
var citizen = require('citizen');
var empty = require('empty');
var page = require('page');
var List = require('proposal-list');
var Article = require('proposal-article');
var Options = require('proposal-options');
var Comments = require('comments-view');
var sidebar = require('sidebar-list');
var classes = require('classes');
var o = document.querySelector.bind(document);
var bus = require('bus');
var log = require('debug')('democracyos:law:page');

page('/law/:id', citizen.optional, load, function(ctx, next) {
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
  .set('Accept', 'application/json')
  .on('error', _handleRequestError)
  .end(function(res) {
    if (!res.ok) return;
    ctx.law = res.body;
    next();
  });
}

/**
 * Handle error from requests
 *
 * @param {Object} err from request
 * @api private
 */

function _handleRequestError (err) {
  console.log(err);
}
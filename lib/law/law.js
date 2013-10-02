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
var log = require('debug')('law:page');

page('/law/:id', citizen.optional, load, function(ctx, next) {
  // Get site's container
  var container = document.querySelector('section.site-content');
  // Empty container before render
  empty(container);

  // Render sidebar list
  container.appendChild(sidebar.render());
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
  article.append(options.render());
  article.append(comments.render());

  container.appendChild(article.render());

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
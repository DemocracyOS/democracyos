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
var log = require('debug')('law:page');

page('/law/:id', citizen.optional, load, function(ctx, next) {
  log('render %s', ctx.path);

  // Get site's container
  var container = document.querySelector('section.site-content');

  // Empty container before render
  empty(container);

  // Build page's content
  var list = new List(ctx.laws, ctx.law);

  // Render sidebar list
  container.appendChild(list.render());

  // Build article's content container
  var article = new Article(ctx.law);
  var articleContainer = article.render();

  // Build article's meta
  var options = new Options(ctx.law, ctx.citizen);
  var comments = new Comments('law', ctx.law.id);

  // Render page's content
  articleContainer.appendChild(options.render());
  articleContainer.appendChild(comments.render());

  container.appendChild(articleContainer);

  comments.fetch();
});

/*
 * Load homepage data
 *
 * @param {Object} ctx page's context
 * @param {Function} next callback after load
 * @api private
 */

function load (ctx, next) {
  log('Loading laws');

  request
  .get('/api/law/all')
  .set('Accept', 'application/json')
  .on('error', _handleRequestError)
  .end(function(res) {
    if (!res.ok) return;

    ctx.laws = res.body;

    request
    .get('/api/law/' + ctx.params.id)
    .set('Accept', 'application/json')
    .on('error', _handleRequestError)
    .end(function(res) {
      if (!res.ok) return;
      ctx.law = res.body;
      next();
    });
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
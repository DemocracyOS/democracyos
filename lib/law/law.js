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

  // Get content's container
  var contentContainer = document.querySelector('section.app-content');

  // Build page's content
  var list = new List(ctx.laws, ctx.law);
  var article = new Article(ctx.law); // !!MUST be aware of citizen's data too
  var options = new Options(ctx.law, ctx.citizen);
  var comments = new Comments('law', ctx.law.id);

  // Render sidebar list
  empty(document.querySelector('aside.nav-proposal'))
    .appendChild(list.render());

  // Empty container before render
  empty(contentContainer);

  // Render page's content
  contentContainer.appendChild(article.render());
  contentContainer.appendChild(options.render());
  contentContainer.appendChild(comments.render());

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
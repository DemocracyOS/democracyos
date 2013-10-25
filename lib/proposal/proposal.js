/**
 * Module dependencies.
 */

var page = require('page')
  , request = require('request')
  , empty = require('empty')
  , citizen = require('citizen')
  , Article = require('proposal-article')
  , List = require('proposal-list')
  , Options = require('proposal-options')
  , Comments = require('comments-view')
  , log = require('debug')('democracyos:proposal');

// Routing
page('/proposal/:id', citizen.optional, load, function(ctx) {
  log('/proposal/%s match', ctx.params.id);

  // Get content's container
  var contentContainer = document.querySelector('section.app-content');

  // Build page's content
  var list = new List(ctx.proposals, ctx.proposal);
  var article = new Article(ctx.proposal); // !!MUST be aware of citizen's data too
  var options = new Options(ctx.proposal, ctx.citizen);
  var comments = new Comments('proposal', ctx.proposal.id);
  comments.fetch();

  // Render sidebar list
  empty(document.querySelector('aside.nav-proposal'))
    .appendChild(list.render());

  // Empty container before render
  empty(contentContainer);

  // Render page's content
  contentContainer.appendChild(article.render());
  contentContainer.appendChild(options.render());
  contentContainer.appendChild(comments.render());
});

/**
 * Load homepage data
 *
 * @param {Object} ctx page's context
 * @param {Function} next callback after load
 * @api private
 */

function load (ctx, next) {
  log('Loading proposals');

  request
  .get('/api/proposal/all')
  .end(function(err, res) {
    if (err || !res.ok) return log('Found error: %s', err || res.error);

    ctx.proposals = res.body;

    request
    .get('/api/proposal/' + ctx.params.id)
    .end(function(err, res) {
      if (err || !res.ok) return log('Found error: %s', err || res.error);
      ctx.proposal = res.body;
      next();
    });
  });
};
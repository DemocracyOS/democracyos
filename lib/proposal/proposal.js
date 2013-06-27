/**
 * Module dependencies.
 */

var page = require('page')
  , request = require('superagent')
  , Citizen = require('citizen')
  , Article = require('proposal-article')
  , List = require('proposal-list')
  , Options = require('proposal-options')
  , Comments = require('proposal-comments');

// Routing
page('/proposal/:id', identify, load, getComments, function(ctx) {
  // Build page's content
  var list = new List(ctx.proposals, ctx.proposal);
  var article = new Article(ctx.proposal); // !!MUST be aware of citizen's data too
  var options = new Options(ctx.proposal, ctx.citizen);
  var comments = new Comments(ctx.proposal, ctx.comments);

  // Render page's content
  replaceWith('nav.sidebar-nav', list.render());
  replaceWith('article.proposal', article.render());
  replaceWith('.proposal-options', options.render());
  replaceWith('.comments', comments.render());
});

/**
 * Load citizen's data
 *
 * @param {Object} ctx page's context
 * @param {Function} next callback after load
 * @api private
 */

function identify (ctx, next) {
  var citizen = new Citizen();
  ctx.citizen = citizen;
  citizen.load('me'); // What would happen on error?
  citizen.ready(next);
}

/**
 * Load homepage data
 *
 * @param {Object} ctx page's context
 * @param {Function} next callback after load
 * @api private
 */

function load (ctx, next) {
  request
  .get('/api/proposal/all')
  .set('Accept', 'application/json')
  .on('error', _handleRequestError)
  .end(function(res) {
    if (!res.ok) return;

    ctx.proposals = res.body || [proposalExample];

    request
    .get('/api/proposal/' + ctx.params.id)
    .set('Accept', 'application/json')
    .on('error', _handleRequestError)
    .end(function(res) {
      if (!res.ok) return;
      ctx.proposal = res.body || proposalExample;
      next();
    });
  });
}

/**
 * Load comments from proposal
 *
 * @param {Object} ctx page's context
 * @param {Function} next callback after load
 * @api private
 */

function getComments (ctx, next) {
  request
  .get('/api/proposal/:id/comments'.replace(':id', ctx.proposal.id))
  .set('Accept', 'application/json')
  .on('error', _handleRequestError)
  .end(function(res) {
    if (!res.ok) return;

    ctx.comments = res.body || commentsExample;

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

/**
 * replaceWith
 *
 * @param {String} selector query string selector
 * @param {NodeElement} el `NodeElement` to replace with match
 * @api private
 */

function replaceWith (selector, el) {
  var match = document.querySelector(selector);
  if (match) {
    match.parentNode.replaceChild(el, match);
  };
}

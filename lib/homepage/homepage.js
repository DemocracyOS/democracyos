/**
 * Module dependencies.
 */

var page = require('page')
  , request = require('superagent')
  , empty = require('empty')
  , citizen = require('citizen')
  , Article = require('proposal-article')
  , List = require('proposal-list')
  , Options = require('proposal-options')
  , Comments = require('proposal-comments')
  , log = require('debug')('homepage');

// Routing.
page('/', identify, load, getComments, function(ctx) {
  log('/homepage match');

  // Get content's container
  var contentContainer = document.querySelector('section.app-content');

  // Build page's content
  var list = new List(ctx.proposals, ctx.proposal);
  var article = new Article(ctx.proposal); // !!MUST be aware of citizen's data too
  var options = new Options(ctx.proposal, ctx.citizen);
  var comments = new Comments(ctx.proposal, ctx.comments);

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
 * Load citizen's data
 *
 * @param {Object} ctx page's context
 * @param {Function} next callback after load
 * @api private
 */

function identify (ctx, next) {
  log('Identifying user');

  ctx.citizen = citizen;
  citizen.load('me');
  citizen.once('error', function(err) {
    log('Found error %s', err);
    next();
  });
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
  log('Loading proposals');

  request
  .get('/api/proposal/all')
  .set('Accept', 'application/json')
  .on('error', _handleRequestError)
  .end(function(res) {
    if (!res.ok) return;

    ctx.proposals = res.body || [proposalExample];
    ctx.proposal = res.body[0] || proposalExample;

    next();
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
  log('Loading comments');

  if (!ctx.proposal.id) {
    ctx.comments = commentsExample;
    return next();
  };
  
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

/**
 * Mocked Proposal Object
 */

var proposalExample = {
  title: "Title Example",
  author: { fullName: "Ricardo Rauch", avatar: "https://si0.twimg.com/profile_images/2583335118/yts2np89ifncbi0j3vgm.jpeg" },
  essay: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a sodales mi. Nullam non nisi sit amet elit interdum pellentesque. Curabitur lobortis neque eu turpis dictum laoreet.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a sodales mi. Nullam non nisi sit amet elit interdum pellentesque. Curabitur lobortis neque eu turpis dictum laoreet.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a sodales mi. Nullam non nisi sit amet elit interdum pellentesque. Curabitur lobortis neque eu turpis dictum laoreet.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a sodales mi. Nullam non nisi sit amet elit interdum pellentesque. Curabitur lobortis neque eu turpis dictum laoreet.",
  tag: { hash: "Tag" },
  participants: [{ fullName: "Ricardo Rauch", avatar: "https://si0.twimg.com/profile_images/2583335118/yts2np89ifncbi0j3vgm.jpeg" },],
  createdAt: new Date(),
  vote: {
    census: [],
    positive: [],
    negative: [],
    toJSON: function() {
      return {census:[1,2,3],positive:[1,2],negative:[3]}
    }
  } 
};

/**
 * Mocked Comments Array
 */

var commentsExample = [{
  author: proposalExample.author,
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a sodales mi. Nullam non nisi sit amet elit interdum pellentesque. Curabitur lobortis neque eu turpis dictum laoreet.",
  createdAt: new Date()
}];

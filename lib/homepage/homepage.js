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
  , Comments = require('comments-view')
  , sidebar = require('sidebar-list')
  , log = require('debug')('homepage');

// Routing.
page('/', citizen.optional, load, function(ctx) {
  // Get site's container
  var container = document.querySelector('section.site-content');
  // Empty container before render
  empty(container);

  // Render sidebar list
  container.appendChild(sidebar.render());

  // Build article's content container
  var article = new Article(ctx.law);

  // Build article's meta
  var options = new Options(ctx.law, citizen);
  var comments = new Comments('law', ctx.law.id);
  comments.fetch();

  article.append(options.render());
  article.append(comments.render());

  container.appendChild(article.render());

  log('render');

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

  // Once ready, fetch article and meta
  // From first sidebar element
  sidebar.ready(function() {
    var law = sidebar.items[0];

    request
    .get('/api/law/' + law.id)
    .set('Accept', 'application/json')
    .end(function(err, res) {
      if (err || !res.ok) {
        log('Load error: %s', err || res.error);
        return;
      };
      ctx.law = law = res.body;
      sidebar.select(law.id);
      next();
    });
  })
}
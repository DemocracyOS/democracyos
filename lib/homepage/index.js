/**
 * Module dependencies.
 */

var express = require('express')
  , path = require('path')
  , api = require('lib/db-api')
  ;

/**
 * Lazy register Homepage Application
 */

var app;

/**
 * Exports Application
 */

module.exports = app = express();


/**
 * Configure Homepage Application
 */

app.configure(function() {
  /**
   * Set view engine for public routes
   */
  
  app.set('view engine', 'jade');

  /**
   * Set views directory for SignUp module
   */
  
  app.set( 'views', path.join( __dirname, '/views' ) );

  /**
   * Set `public-assets` default path
   */

  app.use( express.static( path.join( __dirname, '/public' ) ) );

  /**
   * View `helper` for building up relative routes
   */
  app.locals.url = function(route) {
    var base = app.route || '';
    return path.join(app.route, route)
  };

  app.locals.bodyClasses = ['page-homepage'];

});

var proposalExample = {
  title: "Title Example",
  author: { fullName: "Ricardo Rauch", avatar: "https://si0.twimg.com/profile_images/2583335118/yts2np89ifncbi0j3vgm.jpeg" },
  essay: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a sodales mi. Nullam non nisi sit amet elit interdum pellentesque. Curabitur lobortis neque eu turpis dictum laoreet.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a sodales mi. Nullam non nisi sit amet elit interdum pellentesque. Curabitur lobortis neque eu turpis dictum laoreet.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a sodales mi. Nullam non nisi sit amet elit interdum pellentesque. Curabitur lobortis neque eu turpis dictum laoreet.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a sodales mi. Nullam non nisi sit amet elit interdum pellentesque. Curabitur lobortis neque eu turpis dictum laoreet.",
  tag: { hash: "Tag" },
  participants: [{ fullName: "Ricardo Rauch", avatar: "https://si0.twimg.com/profile_images/2583335118/yts2np89ifncbi0j3vgm.jpeg" },]
};

var proposalsExample = [proposalExample];
var commentsExample = [{
  author: proposalExample.author,
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a sodales mi. Nullam non nisi sit amet elit interdum pellentesque. Curabitur lobortis neque eu turpis dictum laoreet.",

}];

/**
 * Define routes for Homepage module
 */

app.get('/', function(req, res, next) {
  api.proposal.all(function(err, proposals) {
    proposals = proposals.length ? proposals : proposalsExample;
    var proposal = proposals[0];

    api.comment.getFor(proposal.id, function(err, comments) {
      comments = comments.length ? comments : commentsExample;
      res.render('index', { proposals: proposals, proposal: proposal, comments: comments });
    });
  });
});

// !!! This must be handled differently.
app.get('/proposal/:id', function(req, res, next) {
  api.proposal.all(function(err, proposals) {
    api.proposal.get(req.params.id, function(err, proposal) {
      api.comment.getFor(proposal.id, function(err, comments) {
        res.render('index', { proposals: proposals, proposal: proposal, comments: comments });
      });
    });
  });
});
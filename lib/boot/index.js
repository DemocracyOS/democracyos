/**
 * Module dependencies.
 */

var express = require('express')
  , app = module.exports = express()
  , path = require('path')
  , api = require('lib/db-api')

/**
 * Set `views` directory for module
 */

app.set('views', __dirname);

/**
 * Set `view engine` to `jade`.
 */

app.set('view engine', 'jade');

/**
 * View `helper` for building up relative routes
 */

app.locals.url = function(route) {
  return path.join(app.route, route);
}

/**
 * Set up body classes locals.
 */
app.locals.bodyClasses = ['page-homepage'];


/**
 * Demo
 */
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
 * GET index page.
 */

app.get('*', function(req, res) {
  api.proposal.all(function(err, proposals) {
    proposals = proposals.length ? proposals : proposalsExample;
    var proposal = proposals[0];

    api.comment.getFor(proposal.id, function(err, comments) {
      comments = proposals === proposalsExample ? commentsExample : comments;
      res.render('index', { proposals: proposals, proposal: proposal, comments: comments });
    });
  });
});
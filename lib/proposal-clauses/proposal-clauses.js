/**
 * Module dependencies.
 */

var citizen = require('citizen');
var config = require('config');
var request = require('request');
var SideComments = require('side-comments');
var template = require('./template');
var StatefulView = require('stateful-view');

/**
 * Expose `ProposalClauses`
 */

module.exports = ProposalClauses;

function ProposalClauses(law) {
  StatefulView.call(this, template, { clauses: law.clauses });

  this.law = law;
  this.context = 'clause';
  this.loadComments();
}

StatefulView(ProposalClauses);

ProposalClauses.prototype.loadComments = function() {
  this
    .load()
    .ready(this.sideComments.bind(this));
};

ProposalClauses.prototype.load = function(clauseId) {
  var self = this;

  request
    .get('/api/law/:id/clause-comments'.replace(':id', this.law.id))
    .end(function (err, res) {
      if (res.status !== 200) ; //log error

      self.comments = res.body;
      self.state('loaded');
    });

  return this;
};

ProposalClauses.prototype.sideComments = function () {
  // var self = this;
  // citizen.ready(function () {
  //   var userComment = citizen ? { id: citizen.id, avatarUrl: citizen.gravatar, name: citizen.firstName} : null;
  //   var sections = [];
  //   self.comments.forEach(function (comment) {
  //     comment.authorAvatarUrl = comment.author.gravatar;
  //     comment.authorName = comment.author.fullName;
  //     comment.authorId = comment.author.id;
  //     section.comments.push(comment);
  //   });
  //   sections.push(section);
  //   var sideComments = new SideComments('.proposal.commentable-container', userComment, sections, { locale: config['locale'], voting: true });
  //   sideComments.on('commentUpvoted', function (comment) {
  //     console.log(comment);
  //   });
  //   sideComments.on('commentPosted', self.onClauseCommentPosted.bind(self));
  // });
}
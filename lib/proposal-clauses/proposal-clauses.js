/**
 * Module dependencies.
 */

var citizen = require('citizen');
var config = require('config');
var request = require('request');
var SideComments = require('side-comments');
var StatefulView = require('stateful-view');
var t = require('t');
var o = require('dom');
var template = require('./template');
var log = require('debug')('democracyos:proposal-clause');

/**
 * Expose `ProposalClauses`
 */

module.exports = ProposalClauses;

function ProposalClauses(law) {
  StatefulView.call(this, template, { clauses: law.clauses });

  this.law = law;
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

      request
        .get('/api/law/:id/summary-comments'.replace(':id', self.law.id))
        .end(function (err, res) {
          if (res.status !== 200) ; //log error

          self.comments = self.comments.concat(res.body);
          self.state('loaded');
        });
    });

  return this;
};

ProposalClauses.prototype.sideComments = function () {
  var self = this;
  var userComment = citizen.id ? { id: citizen.id, avatarUrl: citizen.profilePictureUrl ? citizen.profilePictureUrl : citizen.gravatar, name: citizen.firstName + ' ' + citizen.lastName, isAdmin: citizen.staff } : null;
  var sections = [];
  var law = this.law;
  var summary = law.summary;

  if (isHTML(summary)) {
    log('This topic has been generated with Quill');
    summary = o(summary);
    var paragraphs = summary[0].children;
    for (var i = 0; i < paragraphs.length; i++) {
      var paragraph = paragraphs[i];
      var section = {};
      section.sectionId = law.id + '-' + i;
      section.comments = self.comments
        .filter(function (comment) { return comment.reference == law.id + '-' + i })
        .map(self.formatComment);

      sections.push(section);
    }
  } else {
    log('This law has been generated in the traditional way (with clauses)');
    var paragraphs = summary.split("\n");
    var i = 0;
    paragraphs.forEach(function (paragraph) {
      if ('' !== paragraph) {
        var section = {};
        section.sectionId = law.id + '-' + i;

        function filterBySection(comment) {
          return comment.reference == law.id + '-' + i;
        }

        section.comments = self.comments.filter(filterBySection).map(self.formatComment);
        sections.push(section);
      }
      i++;
    })
    law.clauses.forEach(function (clause) {
      var section = {};
      section.sectionId = clause.id;

      function filterBySection(comment) {
        return comment.reference == clause.id;
      }

      section.comments = self.comments.filter(filterBySection).map(self.formatComment);
      sections.push(section);
    });
  }

  var sideComments = self.sideComments = new SideComments('.commentable-container', userComment, sections, { trans: t, locale: config.locale });
  sideComments.on('commentPosted', self.onClauseCommentPosted.bind(self));
  sideComments.on('commentUpdated', self.onClauseCommentUpdated.bind(self));
  sideComments.on('commentDeleted', self.onClauseCommentDeleted.bind(self));
}

ProposalClauses.prototype.formatComment = function (comment) {
  comment.authorAvatarUrl = comment.author.profilePictureUrl ? comment.author.profilePictureUrl : comment.author.gravatar;
  comment.authorName = comment.author.fullName;
  comment.authorId = comment.author.id;
  comment.comment = comment.text;
  comment.sectionId = comment.reference;
  return comment;
}

ProposalClauses.prototype.onClauseCommentPosted = function(comment) {
  var self = this;
  var clauseComment = {};
  clauseComment.reference = comment.sectionId;
  if (~comment.sectionId.indexOf('-')) {
    clauseComment.context = 'summary';
  } else {
    clauseComment.context = 'clause';
  }
  clauseComment.text = comment.comment;
  request
  .post(
    '/api/:context/:reference/comment'
    .replace(':context', 'law')
    .replace(':reference', comment.sectionId))
  .send({ comment: clauseComment })
  .end(function(err, res) {
    if (err) return log('Error when posting clause comment %s', err);
    var comment = self.formatComment(res.body);
    self.sideComments.insertComment(comment);
  });
};

ProposalClauses.prototype.onClauseCommentUpdated = function(comment) {
  var self = this;

  request
  .put(
    '/api/comment/' + comment.id)
  .send({ text: comment.comment, reference: comment.sectionId })
  .end(function(err, res) {
    if (err) return log('Error when putting clause comment %s', err);
    var comment = self.formatComment(res.body);
    self.sideComments.replaceComment(comment);
  });
};

ProposalClauses.prototype.onClauseCommentDeleted = function(comment) {
  var self = this;
  request
    .del('/api/comment/:id'
      .replace(':id', comment.id))
    .end(function(err, res) {
      if (err) return log('Fetch error: %s', err);
      if (!res.ok) err = res.error, log('Fetch error: %s', err);
      if (res.body && res.body.error) err = res.body.error, log('Fetch response error: %s', err);

      self.sideComments.removeComment(comment.sectionId, comment.id);
    });
};

/**
 * Check if the string is HTML
 *
 * @param {String} str
 * @return {Boolean}
 * @api private
 */

function isHTML(str) {
  // Faster than running regex, if str starts with `<` and ends with `>`, assume it's HTML
  if (str.charAt(0) === '<' && str.charAt(str.length - 1) === '>' && str.length >= 3) return true;

  // Run the regex
  var match = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/.exec(str);
  return !!(match && match[1]);
}

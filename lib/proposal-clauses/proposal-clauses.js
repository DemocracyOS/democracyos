import t from 't-component';
import o from 'component-dom';
import debug from 'debug';
import citizen from '../citizen/citizen.js';
import config from '../config/config.js';
import request from '../request/request.js';
import SideComments from 'side-comments';
import View from '../view/view.js';
import template from './template.jade';

let log = debug('democracyos:proposal-clause');

export default class ProposalClauses extends View {

  constructor (law) {
    super(template, { clauses: law.clauses });
    this.law = law;
    this.loadComments();
  }

  loadComments () {
    this
      .load()
      .ready(this.sideComments.bind(this));
  }

  load (clauseId) {
    let self = this;

    request
      .get('/api/law/:id/clause-comments'.replace(':id', this.law.id))
      .end((err, res) => {
        if (res.status !== 200) ; //log error

        self.comments = res.body;

        request
          .get('/api/law/:id/summary-comments'.replace(':id', self.law.id))
          .end((err, res) => {
            if (res.status !== 200) ; //log error

            self.comments = self.comments.concat(res.body);
            self.state('loaded');
          });
      });

    return this;
  }

  sideComments  () {
    let self = this;
    let userComment = citizen.id ? {
      id: citizen.id,
      avatarUrl: citizen.avatar,
      name: citizen.firstName + ' ' + citizen.lastName,
      isAdmin: citizen.staff
    }
    : null;

    let sections = [];
    let law = this.law;
    let summary = law.summary;
    let paragraphs = summary.split("\n");
    let i = 0;

    paragraphs.forEach((paragraph) => {
      if ('' != paragraph) {
        let section = {};
        section.sectionId = law.id + '-' + i;

        let filterBySection = comment => comment.reference == law.id + '-' + i;

        section.comments = self.comments.filter(filterBySection).map(self.formatComment);
        sections.push(section);
      }
      i++;
    });

    law.clauses.forEach((clause) => {
      let section = {};
      section.sectionId = clause.id;

      function filterBySection(comment) {
        return comment.reference == clause.id;
      }

      section.comments = self.comments.filter(filterBySection).map(self.formatComment);
      sections.push(section);
    });

    let sideComments = self.sideComments = new SideComments('.commentable-container', userComment, sections, { trans: t, locale: config.locale, reference: self.reference });
    sideComments.on('commentPosted', self.onClauseCommentPosted.bind(self));
    sideComments.on('commentUpdated', self.onClauseCommentUpdated.bind(self));
    sideComments.on('commentDeleted', self.onClauseCommentDeleted.bind(self));
  }

  formatComment (comment) {
    comment.authorAvatarUrl = comment.author.avatar;
    comment.authorName = comment.author.fullName;
    comment.authorId = comment.author.id;
    comment.comment = comment.text;
    comment.sectionId = comment.reference;
    return comment;
  }

  onClauseCommentPosted (comment) {
    let self = this;
    let clauseComment = {};
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
      let comment = self.formatComment(res.body);
      self.sideComments.insertComment(comment);
    });
  }

  onClauseCommentUpdated (comment) {
    let self = this;

    request
    .put(
      '/api/comment/' + comment.id)
    .send({ text: comment.comment, reference: comment.sectionId })
    .end(function(err, res) {
      if (err) return log('Error when putting clause comment %s', err);
      let comment = self.formatComment(res.body);
      self.sideComments.replaceComment(comment);
    });
  };

  onClauseCommentDeleted (comment) {
    let self = this;
    request
      .del('/api/comment/:id'
        .replace(':id', comment.id))
      .end(function(err, res) {
        if (err) return log('Fetch error: %s', err);
        if (!res.ok) err = res.error, log('Fetch error: %s', err);
        if (res.body && res.body.error) err = res.body.error, log('Fetch response error: %s', err);

        self.sideComments.removeComment(comment.sectionId, comment.id);
      });
  }
}

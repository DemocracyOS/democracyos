import t from 't-component';
import debug from 'debug';
import user from '../user/user.js';
import config from '../config/config.js';
import request from '../request/request.js';
import SideComments from 'democracyos-side-comments';
import View from '../view/view.js';
import template from './template.jade';

let log = debug('democracyos:proposal-clauses');

export default class ProposalClauses extends View {

  constructor (topic) {
    super(template, { clauses: topic.clauses });
    this.topic = topic;
    this.loadComments();
  }

  _handleError (err) {
    // FIXME: We need visual feedback here
    log('Error: %j', err);
  }

  loadComments () {
    this
      .load()
      .ready(this.sideComments.bind(this));
  }

  load () {
    let self = this;

    request
      .get(`/api/topic/${this.topic.id}/sidecomments`)
      .end((err, res) => {
        if (err) return self._handleError(err);
        self.comments = res.body;
        self.state('loaded');
      });

    return this;
  }

  sideComments () {
    let className = '.commentable-container';
    let sections = this.getClausesSections();
    let locals = { trans: t, locale: config.locale, reference: this.reference };
    let userComment = user.id ? {
      id: user.id,
      avatarUrl: user.avatar,
      name: user.firstName + ' ' + user.lastName
    } : null;

    let sideComments = new SideComments(className, userComment, sections, locals);
    sideComments.on('commentPosted', this.onClauseCommentPosted.bind(this));
    sideComments.on('commentUpdated', this.onClauseCommentUpdated.bind(this));
    sideComments.on('commentDeleted', this.onClauseCommentDeleted.bind(this));

    this.sideComments = sideComments;
  }

  getClausesSections () {
    // FIXME: Fix this, please. Wat?
    let topic = this.topic;
    let self = this;
    let sections = [];

    function filterBySection(index) {
      return function (comment) {
        return comment.reference == topic.id + '-' + index;
      }
    }

    topic.clauses.forEach(function (clause) {
      let section = {};
      section.sectionId = clause.id;

      function filterBySection(comment) {
        return comment.reference == clause.id;
      }

      section.comments = self.comments.filter(filterBySection).map(self.formatComment);
      sections.push(section);
    });

    return sections;
  }

  formatComment (comment) {
    comment.authorAvatarUrl = comment.author.avatar;
    comment.authorName = comment.author.fullName;
    comment.authorId = comment.author.id;
    comment.comment = comment.text;
    comment.sectionId = comment.reference;
    return comment;
  }

  _insertComment (err, res) {
    if (err) return log('Error when posting clause comment %s', err);
    let comment = this.formatComment(res.body);
    this.sideComments.insertComment(comment);
  }

  _replaceComment (err, res) {
    if (err) return log('Error when posting clause comment %s', err);
    let comment = this.formatComment(res.body);
    this.sideComments.replaceComment(comment);
  }

  onClauseCommentPosted (comment) {
    request
      .post(`/api/topic/${comment.sectionId}/comment`)
      .send({
        topicId: this.topic.id,
        context: 'paragraph',
        text: comment.comment,
        reference: comment.sectionId
      })
      .end(this._insertComment.bind(this));
  }

  onClauseCommentUpdated (comment) {
    request
      .put(`/api/comment/${comment.id}`)
      .send({ text: comment.comment, reference: comment.sectionId })
      .end(this._replaceComment.bind(this));
  }

  onClauseCommentDeleted (comment) {
    let self = this;
    request
      .del(`/api/comment/${comment.id}`)
      .end((err, res) => {
        if (err) return self._handleError(err);
        self.sideComments.removeComment(comment.sectionId, comment.id);
      });
  }
}

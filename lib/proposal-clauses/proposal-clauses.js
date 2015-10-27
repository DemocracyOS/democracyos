import t from 't-component';
import debug from 'debug';
import user from '../user/user.js';
import config from '../config/config.js';
import SideComments from 'democracyos-side-comments';
import View from '../view/view.js';
import template from './template.jade';
import commentStore from '../comment-store/comment-store.js';

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
    commentStore
      .sideComments({id: this.topic.id})
      .then(comments => {
        this.comments = comments;
        this.state('loaded');
        this.sideComments.bind(this);
      })
      .catch(err => {
        this._handleError(err);
      });
      this.ready(this.sideComments.bind(this));
  }

  sideComments () {
    let className = '.commentable-container';
    let sections = this.getClausesSections();
    let locals = { trans: t, locale: config.locale, reference: this.reference };
    let userComment = user.id ? {
      id: user.id,
      avatarUrl: user.avatar,
      name: user.firstName + ' ' + user.lastName,
      isAdmin: user.staff
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

  onClauseCommentPosted (comment) {
    commentStore
      .comment(this.topic.id, {
        itemId: this.topic.id,
        context: 'paragraph',
        text: comment.comment,
        reference: comment.sectionId
      })
      .then(body => {
        let comment = this.formatComment(body);
        this.sideComments.insertComment(comment);
      })
      .catch(err => {
        if (err) return log('Error when posting clause comment %s', err);
      });
  }

  onClauseCommentUpdated (comment) {
    commentStore
      .editComment(comment.id, {text: comment.comment, reference: comment.sectionId })
      .then(body => {
        let comment = this.formatComment(body);
        this.sideComments.replaceComment(comment);
      })
      .catch(err => {
        if (err) return log('Error when posting clause comment %s', err);
      });
  }

  onClauseCommentDeleted (comment) {
    commentStore
      .deleteComment(comment.id)
      .then(res => {
        this.sideComments.removeComment(comment.sectionId, comment.id);
      })
      .catch(err => {
        this._handleError(err);
      });
  }
}

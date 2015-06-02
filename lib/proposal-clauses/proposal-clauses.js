import t from 't-component';
import o from 'component-dom';
import debug from 'debug';
import user from '../user/user.js';
import config from '../config/config.js';
import request from '../request/request.js';
import SideComments from 'side-comments';
import View from '../view/view.js';
import template from './template.jade';

let log = debug('democracyos:proposal-clause');

export default class ProposalClauses extends View {

  constructor (topic) {
    super(template, { clauses: topic.clauses });
    this.topic = topic;
    this.loadComments();
  }

  loadComments () {
    this
      .load()
      .ready(this.sideComments.bind(this));
  }

  load () {
    let self = this;

    request
      .get('/api/topic/:id/clause-comments'.replace(':id', this.topic.id))
      .end((err, res) => {
        if (res.status !== 200) ; //log error

        self.comments = res.body;

        request
          .get('/api/topic/:id/summary-comments'.replace(':id', self.topic.id))
          .end((err, res) => {
            if (res.status !== 200) ; //log error

            self.comments = self.comments.concat(res.body);
            self.state('loaded');
          });
      });

    return this;
  }

  sideComments  () {
    let topic = this.topic;
    let className = '.commentable-container';

    let userComment = user.id ? {
      id: user.id,
      avatarUrl: user.avatar,
      name: user.firstName + ' ' + user.lastName,
      isAdmin: user.staff
    } : null;

    let sections;
    if (this.isHTML(topic.summary)) {
      sections = this.getSections(topic);
    } else {
      sections = this.getClausesSections(topic);
    }

    let locals = { trans: t, locale: config.locale };

    let sideComments = new SideComments(className, userComment, sections, locals);
    sideComments.on('commentPosted', this.onClauseCommentPosted.bind(this));
    sideComments.on('commentUpdated', this.onClauseCommentUpdated.bind(this));
    sideComments.on('commentDeleted', this.onClauseCommentDeleted.bind(this));

    this.sideComments = sideComments;
  }

  getSections (topic) {
    log('This topic has been generated with Quill');
    let sections = [];
    let summary = o(topic.summary);
    let paragraphs = summary[0].childNodes;

    function byReference(index) {
      return function (comment) {
        return comment.reference == topic.id + '-' + index;
      }
    }

    for (let i = 0; i < paragraphs.length; i++) {
      let section = {};
      section.sectionId = topic.id + '-' + i;
      section.comments = this.comments
        .filter(byReference(i))
        .map(this.formatComment);

      sections.push(section);
    }

    return sections;
  }

  getClausesSections (topic) {
    log('This topic has been generated in the traditional way (with clauses)');
    let self = this;
    let paragraphs = topic.summary.split('\n');
    let sections = [];

    function filterBySection(index) {
      return function (comment) {
        return comment.reference == topic.id + '-' + index;
      }
    }

    let i = 0;
    paragraphs.forEach(function (paragraph) {
      if (!paragraph) return;
      let section = {};
      section.sectionId = topic.id + '-' + i;
      section.comments = self.comments
        .filter(filterBySection(i))
        .map(self.formatComment);
      sections.push(section);
      i++;
    })

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

  isHTML (str) {
    // Faster than running regex, if str starts with `<` and ends with `>`, assume it's HTML
    if (str.charAt(0) === '<' && str.charAt(str.length - 1) === '>' && str.length >= 3) return true;

    // Run the regex
    var match = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/.exec(str);
    return !!(match && match[1]);
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
      .replace(':context', 'topic')
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
  }

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

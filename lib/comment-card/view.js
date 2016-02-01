import o from 'component-dom';
import user from '../user/user';
import config from '../config/config';
import markdown from 'marked';
import request from '../request/request';
import template from './template.jade';
import CommentsEditView from '../comments-edit/view';
import CommentsRepliesView from '../comments-replies/view';
import CommentVote from '../comment-vote/view';
import View from '../view/view';
import t from 't-component';
import debug from 'debug';

let log = debug('democracyos:comments-view');

export default class CommentCard extends View {
  constructor (options = {}) {
    super();
    this.options = options;
    this.comment = options.comment;
    this.setLocals();
    super(template, this.locals);
    this.initializeVote();
    this.editButton = this.find('.btn-edit');
    this.scoreCounter = this.find('.comment-counter');
    this.mediaBody = this.find('.media-body');
  }

  switchOn () {
    this.bind('click', '.link-report', 'onflag');
    this.bind('click', '.btn-edit', 'onedit');
    this.bind('click', '.btn-remove', 'onremove');
    this.bind('click', 'a.cancel-remove', 'oncancelremove');
    this.bind('click', 'a.confirm-remove', 'onconfirmremove');
    this.bind('click', 'span.show-spam a', 'onshowspam');
    this.bind('click', 'a.comment-reply', 'onreplyclick');
  }

  switchOff () {
    if (this.commentsRepliesView) {
      this.commentsRepliesView.off('post', this.bound('newreply'));
      this.commentsRepliesView.off('delete', this.bound('removereply'));
    }
  }

  setLocals () {
    let locals = {};
    let comment = locals.comment = this.comment;
    locals.canComment = this.options.canComment;
    locals.markdown = markdown;
    locals.flags = !!~comment.flags.map(function(v) { return v.author; }).indexOf(user.id);
    locals.own = comment.author.id == user.id;
    locals.repliesCounter = comment.replies.length;
    if (config.spamLimit) {
      locals.spam = comment.flags.length > config.spamLimit;
    } else {
      locals.spam = comment.flags.length > (comment.upvotes.length - comment.downvotes.length);
    }
    locals.avatar = comment.author.avatar;
    locals.classes = [];
    if (locals.own) locals.classes.push('own');
    if (locals.spam) locals.classes.push('spam');
    this.locals = locals;
  }

  initializeVote () {
    this.commentVote = new CommentVote(this.comment);
    this.el.find('.comment-actions').prepend(this.commentVote.render());
    this.commentVote.on('error', this.bound('voteError'));
    this.commentVote.on('loginrequired', this.bound('loginRequired'));
  };

  voteError (message) {
    message = message || '';
    this.find('.error')
      .css('display', 'block')
      .html(message);
  };

  loginRequired () {
    this.find('.loginrequired').css('display', 'block');
  }

  onflag (ev) {
    ev.preventDefault();

    let comment = this.comment;
    let target = this.find('.link-report');
    let isSpam = this.locals.spam;
    let flagging = !this.locals.flags;

    target.toggleClass('selected');
    flagging ? target.attr('title', t('comment-card.not-spam')) : target.attr('title', t('comment-card.report-spam'));
    let flagsCounter = comment.flags.length + (flagging ? 1 : -1);
    let spam;
    if (config.spamLimit) {
      spam = flagsCounter > config.spamLimit;
    } else {
      spam = flagsCounter > (comment.upvotes.length - comment.downvotes.length);
    }
    if (spam) {
      this.el.addClass('spam');
    } else {
      this.el.removeClass('spam');
    }

    let self = this;
    request
    .post(this.url() + '/:action'.replace(':action', flagging ? 'flag' : 'unflag'))
    .end((err, res) => {
      if (err) return handleError(err);
      if (!res.ok) return handleError(res.error);
      if (res.body && res.body.error) return handleError(res.body.error);

      log('successfull %s as spam %s', flagging ? 'flag' : 'unflag', self.comment.id);
      let count = target.find('.count');
      let innerCount = count.html() != '' ? parseInt(count.html()) : 0;
      innerCount += (flagging ? 1 : -1);
      count.html(innerCount ? innerCount : '');
      self.locals.flags = flagging;

      let handleError = (error) => {
        log('Fetch response error: %s', error);
        if (flagging) self.el.removeClass('spam');
        return target.removeClass('selected');
      }
    });
  }

  onshowspam (ev) {
    ev.preventDefault();
    this.el.removeClass('spam');
  }

  onedit (ev) {
    ev.preventDefault();
    this.find('a.btn-edit').addClass('hide');
    let form = this.mediaBody.find('form');

    if (!form.length) {
      let commentsEdit = this.commentsEdit = new CommentsEditView(this.comment);
      commentsEdit.appendTo(this.mediaBody[0]);
      commentsEdit.on('put', this.onsuccessedit.bind(this));
      commentsEdit.on('remove', this.oncanceledit.bind(this));
    }

    this.mediaBody.addClass('edit');
  }


  oncanceledit () {
    this.mediaBody.removeClass('edit');
    this.find('.btn-edit').removeClass('hide');
  }

  onsuccessedit (data) {
    let commentText = this.find('.comment-text');
    let commentTime = this.find('.ago')[0];
    let edited = this.find('.edited');

    commentText.html(markdown(data.text));

    if (!edited.length) {
      let small = o('<small></small>');
      small.addClass('edited');
      small.html(' · ' + t('comments.edited'));
      commentTime.parentNode.insertBefore(small[0], commentTime.nextSibling);
    }

    this.find('.btn-edit').removeClass('hide');
    this.mediaBody.removeClass('edit');
    this.commentsEdit.remove();

    this.comment.text = data.text;
    this.comment.editedAt = data.editedAt;
  }

  onremove (ev) {
    ev.preventDefault();
    this.el.addClass('remove');
    this.editButton.removeClass('hide');
    this.mediaBody.removeClass('edit');
  }

  oncancelremove (ev) {
    ev.preventDefault();
    this.el.removeClass('remove');
  }


  /**
   * Confirm comment removal
   *
   * @param {Event} ev
   * @api private
   */

  onconfirmremove (ev) {
    ev.preventDefault();

    var comment = this.comment;
    var author = comment.author;
    var own = author.id == user.id;
    var self = this;
    var id = comment.id;

    request
      .del(this.url())
      .end((err, res) => {
        if (err) return log('Fetch error: %s', err);
        if (!res.ok) err = res.error, log('Fetch error: %s', err);
        if (res.body && res.body.error) err = res.body.error, log('Fetch response error: %s', err);

        self.el.removeClass('remove');
        var messageEl = self.find('.oncomment.message');
        messageEl.css('display', 'block');
        if (err) {
          messageEl.html(err);
        } else {
          log('successfull upvote %s', id);
          messageEl.html(t('comments.removed'));
          setTimeout(() => {
            self.el.remove();
            self.emit('delete', self.comment);
          }, 2500);
        }
    });
  }

  /**
   * Show comment replies
   */

  onreplyclick (ev) {
    ev.preventDefault();

    let target = this.find('a.reply-comments');
    let repliesContainer = this.find('.replies-container');
    repliesContainer.empty().toggleClass('no-hide');
    if (repliesContainer.hasClass('no-hide')) {
      let commentsRepliesView = this.commentsRepliesView = new CommentsRepliesView(this.comment);
      commentsRepliesView.appendTo(repliesContainer[0]);
      commentsRepliesView.on('post', this.bound('newreply'));
      commentsRepliesView.on('delete', this.bound('removereply'));
      commentsRepliesView.on('remove', this.bound('cancelreply'));
    }
  }

  /**
   * New reply submitted
   */

  newreply (reply) {
    let replyCounter = this.find('.reply-counter');
    let counter = replyCounter.html() != '' ? parseInt(replyCounter.html()) : 0;
    this.find('.comment-action.btn-remove').addClass('hide');
    counter++;
    replyCounter.html(counter);
  }

  /**
   * Cancel reply
   */

  cancelreply () {
    this.find('.replies-container').removeClass('no-hide');
  }

  /**
   * Reply deleted
   */

  removereply (data) {
    let replyCounter = this.find('.reply-counter');
    let counter = replyCounter.html() != '' ? parseInt(replyCounter.html()) : 0;
    let btnRemove = this.find('.comment-action.btn-remove');
    counter--;
    if (!counter) {
      btnRemove.removeClass('hide');
      replyCounter.html('');
    } else {
      replyCounter.html(counter);
    }
  }

  url () {
    return '/api/comment/:id'.replace(':id', this.comment.id);
  }
}

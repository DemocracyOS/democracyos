import o from 'component-dom';
import t from 't-component';
import debug from 'debug';
import loading from 'democracyos-loading-lock';
import user from '../user/user.js';
import config from '../config/config.js';
import CommentCard from '../comment-card/view.js';
import CommentsFilter from '../comments-filter/view.js';
import FormView from '../form-view/form-view.js';
import request from '../request/request.js';
import template from './template.jade';
import submit from '../submit';

let log = debug('democracyos:comments-view');

export default class CommentsView extends FormView {

  /**
   * Creates a CommentsView
   *
   * @param {String} reference
   */

  constructor (options = {}) {
    super(template, {
      topic: options.topic,
      reference: options.topic.url,
      canComment: options.canComment
    });

    this.options = options;
    this.topic = options.topic;
    this.page = 0;
    this.filter = new CommentsFilter();
    this.sort = this.filter.getSort();
    this.filter.appendTo(this.find('.all-comments h4')[0]);

    this.comments = [];
    this.mycomments = [];
    this.textarea = this.find('textarea');
    this.form = this.find('form')[0];
  }

  initialize () {
    this.initializeComments();
    this.initializeMyComments();
  }

  /**
   * Load initial set of comments
   *
   * @api public
   */

  initializeComments () {
    this.page = 0;
    this.comments = [];
    this.find('btn.load-comments').addClass('hide');
    var view = this;
    request
    .get(this.url() + '/comments')
    .query({ count: true })
    .query({ sort: this.sort })
    .query({ exclude_user: user.id || null })
    .end((err, res) => {
      if (err) {
        log('Fetch error: %s', err);
        return;
      }
      if (!res.ok) {
        log('Fetch error: %s', res.error);
        return;
      }
      if (res.body && res.body.error) {
        log('Fetch response error: %s', res.body.error);
        return;
      }
      view.count = res.body;
      view.fetch();
    });
  }

  /**
   * Load user's comments
   *
   * @api public
   */

  initializeMyComments () {
    if (!this.options.canComment) return;
    if (user.id) {
      var view = this;
      request
      .get(this.url() + '/my-comments')
      .end((err, res) => {
        if (err) {
          log('Fetch error: %s', err);
          return;
        };
        if (!res.ok) {
          log('Fetch error: %s', res.error);
          return;
        };
        if (res.body && res.body.error) {
          log('Fetch response error: %s', res.body.error);
          return;
        };
        view.emit('fetch my comments', res.body);
      });
    }
  }

  /**
   * Fetch comments
   *
   * @api public
   */

  fetch () {
    var view = this;
    this.loadingComments();
    request
      .get(view.url() + '/comments')
      .query({ page: view.page })
      .query({ sort: view.sort })
      .query({ limit: config.commentsPerPage })
      .query({ exclude_user: user.id || null })
      .end((err, res) => {
        view.unloadingComments();
        if (err) {
          log('Fetch error: %s', err);
          return;
        };
        if (!res.ok) {
          log('Fetch error: %s', res.error);
          return;
        };
        if (res.body && res.body.error) {
          log('Fetch response error: %s', res.body.error);
          return;
        };
        view.emit('fetch', res.body);
      });
  }

  switchOn () {
    this.bind('click', '.new-comment', 'showNewComment');
    this.bind('click', '.cancel-new-comment', 'hideNewComment');
    this.bind('click', '.load-comments', 'fetch');
    this.bind('keydown', 'textarea', 'onkeydown');
    this.on('success', this.bound('onsuccess'));
    this.on('fetch', this.bound('load'));
    this.on('fetch my comments', this.bound('loadMyComments'));
    this.on('post', this.bound('addmycomment'));
    this.on('no more comments', this.nomorecomments.bind(this));
    this.on('more comments', this.morecomments.bind(this));
    this.filter.on('change', this.bound('onfilterchange'));
  };

  switchOff () {
    this.filter.off('change', this.bound('onfilterchange'));
  };

  /**
   * Load comments in view's `el`
   *
   * @param {Array} comments
   * @api public
   */

  loadMyComments (comments) {
    if (comments.length) {
      this.hideNewComment();
      comments.forEach(this.bound('addmycomment'));
    } else {
      this.find('.cancel-new-comment').addClass('hide');
    }
  };

  /**
   * Load comments in view's `el`
   *
   * @param {Array} comments
   * @api public
   */

  load (comments) {
    if( !comments.length ) return this.refreshState();

    log('load %o', comments);

    var els = this.find('.all-comments li.comment-item');

    this.add(comments);

    if (!this.page) {
      els.remove();
    }

    if (this.comments.length == this.count) {
      this.emit('no more comments');
    } else {
      this.emit('more comments');
    }

    this.refreshState();

    this.page++;
    this.emit('load');
  };

  refreshState () {
    if (!this.comments.length || this.comments.length === 1) {
      this.filter.el.addClass('hide');
    } else {
      this.filter.el.removeClass('hide');
    }

    if (!this.comments.length) {
      let span = o('<span></span>');
      let text = user.id ? t('comments.no-user-comments') : t('comments.no-comments');
      span.html(text).addClass('no-comments');
      let existing = this.find('.no-comments');
      if (existing.length) existing.remove();
      this.find('.comments-list').append(span[0]);
      return this.emit('no more comments');
    }
  };

  add (comment) {
    var self = this;

    if (Array.isArray(comment)) {
      comment.forEach((c) => self.add(c));
      return;
    }

    var card = new CommentCard({
      canComment: this.options.canComment,
      comment
    });

    this.comments.push(comment);
    var container = this.find('.comments-list')[0];
    card.appendTo(container);
    card.on('delete', function(){
      self.comments.splice(self.comments.indexOf(comment), 1);
      self.bound('refreshState')();
    });
  }

  addmycomment (comment) {
    let card = new CommentCard(comment);
    let container = this.find('.my-comments-list')[0];
    this.mycomments.push(comment);
    card.appendTo(container);
    card.on('delete', this.bound('removemycomment'));
  }

  removemycomment (comment) {
    let i = this.mycomments.indexOf(comment);
    this.mycomments.splice(i, 1);
    if (!this.mycomments.length) {
      this.find('.comment-form').removeClass('hide');
      this.find('.new-comment').addClass('hide');
      this.find('.cancel-new-comment').addClass('hide');
    }
  }

  onsuccess (res) {
    this.addmycomment(res.body);
    this.hideNewComment();
    this.track(res.body);
  }

  track(comment) {
    analytics.track('comment', {
      comment: comment.id
    });
  }

  showNewComment (ev) {
    ev.preventDefault();

    let form = this.find('.comment-form');
    form.toggleClass('hide');
    this.find('.new-comment').addClass('hide');

    if (!form.hasClass('hide')) {
      let textarea = this.find('p textarea', form)[0];
      form[0].scrollIntoView();
      textarea.focus();
    }
  }

  hideNewComment () {
    this.textarea.val('');

    this.find('.comment-form').toggleClass('hide');
    this.find('.new-comment').removeClass('hide');
    this.find('span.error').remove();
    this.find('.error').removeClass('error');
  }

  /**
   * Display a spinner when loading comments
   *
   * @api public
   */

  loadingComments () {
    this.list = this.find('.inner-container')[0];
    this.loadingSpinner = loading(this.list, { size: 100 }).lock();
  }

  /**
   * Remove spinner when comments are loaded
   */

  unloadingComments () {
    this.loadingSpinner.unlock();
  }

  /**
   * When there are more comments to show
   *
   * @api public
   */

  morecomments () {
    this.find('.load-comments').removeClass('hide');
  }

  /**
   * When there are no more comments to show
   *
   * @api public
   */

  nomorecomments () {
    this.find('.load-comments').addClass('hide');
  }

  /**
   * When comments filter change,
   * re-fetch comments
   *
   * @api public
   */

  onfilterchange (sort) {
    this.sort = this.filter.getSort();
    this.initializeComments();
  }

  /**
   * Submit if meta key is pressed
   *
   * @param  {Event} ev keydown event
   */

  onkeydown (ev) {
    if (ev.keyCode == 13 && (ev.metaKey || ev.ctrlKey)) {
      submit(this.form);
    }
  }

  /**
   * Get api route
   */

  url () {
    return '/api/topic/:id'.replace(':id', this.topic.id);
  }
}

import debug from 'debug';
import o from 'component-dom';
import closest from 'component-closest';
import markdown from 'marked';
import t from 't-component';
import bus from 'bus';
import serialize from 'get-form-data';
import View from '../view/view.js';
import CommentsRepliesEditView from '../comments-replies-edit/view.js';
import { dom } from '../render/render.js';
import request from '../request/request.js';
import commentsReplies from './comments-replies.jade';
import commentsReply from './comments-reply.jade';
import submit from '../submit';

let log = debug('democracyos:comments-reply');

export default class CommentsRepliesView extends View {

  constructor (comment) {
    super(commentsReplies, { comment: comment });
    this.comment = comment;
    this.form = this.find('form')[0];
    this.state('initialized');
    this.fetch();
  }

  /**
   * Switch on events
   *
   * @api public
   */

  switchOn () {
    this.bind('keydown', 'textarea', 'onkeydown');
    this.bind('submit', 'form.reply-form', 'onsubmit');
    this.bind('click', 'a.btn-cancel', 'oncancel');
    this.bind('click', 'a.btn-reply-edit', 'onedit');
    this.bind('click', 'a.btn-reply-remove', 'onremove');
    this.bind('click', 'a.cancel-reply-remove', 'oncancelremove');
    this.bind('click', 'a.confirm-reply-remove', 'onconfirmremove');
    this.on('post', this.bound('onpost'));
  }

  oncancel (ev) {
    ev.preventDefault();
    this.remove();
  }

  /**
   * Click event handler
   *
   * @param {Event} ev
   * @api private
   */

  onreplyclick (ev) {
    this.fetch();
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
   * Submit form handler
   *
   * @param {Event} ev
   * @api private
   */

  onsubmit (ev) {
    ev.preventDefault();

    let data = serialize(ev.target);
    let errors = this.validate(data);
    this.errors(errors)
    if (errors.length) return log('Found errors: %o', errors);
    this.emit('submit', data);
    this.post(data);
  }

  /**
   * Show edit box
   *
   * @param {Event} ev
   * @api private
   */

  onedit (ev) {
    ev.preventDefault();
    let target = ev.delegateTarget || closest(ev.target, 'a');
    let commentEl = closest(target, 'li[data-id]');
    o(target).addClass('hide');
    let el = o('.media-body', commentEl);
    let form = o('form', el);

    if (!form || !form.length) {
      let id = commentEl.getAttribute('data-id');
      let reply = this.replies.find(i => i.id == id);
      let replyEdit = new CommentsRepliesEditView(this.comment, reply);
      replyEdit.appendTo(el);
      replyEdit.on('cancel', this.bound('oncanceledit'));
      replyEdit.on('put', this.bound('onsuccessedit'));
    }

    o(el).addClass('edit');
  }

  /**
   * Cancel reply edition
   *
   * @param {Event} ev
   * @api private
   */

   oncanceledit (el) {
    o(el.parentNode).removeClass('edit');
    let btn = o('.btn-reply-edit', el.parentNode);
    o(btn).removeClass('hide');
    el.parentNode.removeChild(el);
  }

  /**
   * Succesful reply edition
   *
   * @param {Event} ev
   * @api private
   */

  onsuccessedit (data) {
    let el = data.el;
    data = data.data;
    let replyContainer = el.parentNode;
    let replyEl = replyContainer.parentNode;
    let id = data.id;

    let replyText = replyEl.querySelector('.reply-text');
    replyText.innerHTML = markdown(data.text);

    let replyTime = replyEl.querySelector('.ago');
    let edited = replyEl.querySelector('.edited');
    if (!edited) {
      let small = document.createElement('small');
      small.classList.add('edited');
      small.innerHTML = '· ' + t('comments.edited');
      replyTime.parentNode.insertBefore(small, replyTime.nextSibling);
    }

    let btn = replyEl.querySelector('.btn-reply-edit');
    btn.classList.remove('hide');
    el.parentNode.classList.remove('edit');
    replyContainer.removeChild(el);

    let reply = this.replies.find(i => i.id == id);
    reply.text = data.text;
    reply.editedAt = data.editedAt;
  }

  /**
   * Successful submit handler
   *
   * @param {Event} ev
   * @api private
   */

  onpost (reply) {
    this.add(reply);
    this.find('textarea').val('');
  }

  /**
   * Add a reply
   *
   * @param {Event} ev
   * @api private
   */

  add (reply) {
    let commentRepliesEl = this.find('ul.replies');
    let commentsReplyEl = dom(commentsReply, { reply: reply, markdown: markdown, comment: this.comment });
    commentRepliesEl.append(commentsReplyEl);
    this.replies.push(reply);
  }

  /**
   * Post a reply
   *
   * @param {Object} data
   * @api public
   */

  post (data) {
    var view = this;

    request
    .post('/api/comment/' + this.comment.id + '/reply')
    .send({ reply: data })
    .end((err, res) => {
      if (res.body && res.body.error) {
        return log('Fetch response error: %s', res.body.error), view.errors([res.body.error]);
      }

      if (err || !res.ok) return log('Fetch error: %s', err || res.error);

      view.emit('post', res.body);
    });
  }

  /**
   * Render element
   */

  appendTo (el) {
    let view = this;

    this.ready(() => {
      // if string, then query element
      if ('string' === typeof el) el = o(el);

      view.replies.forEach(reply => view.add(reply));
      super.appendTo(el);
      view.focus();
      return view;
    });
  }

  /**
   * Fetch `topics` from source
   *
   * @param {String} src
   * @api public
   */

  fetch (src) {
    log('request in process');
    src = src || '/api/comment/:id/replies'.replace(':id', this.comment.id);
    let view = this;

    this.state('loading');

    request
    .get(src)
    .end((err, res) => {
      if (err || !res.ok) {
        let message = ['Unable to load replies. Please try reloading the page. Thanks!'];
        return view.errors(message);
      }

      view.set(res.body);
    });
  }

  /**
   * Set replies to `v`
   *
   * @param {Array} v
   * @return {CommentsRepliesView} Instance of `CommentsRepliesView`
   * @api public
   */

  set (v) {
    this.replies = v;
    this.state('loaded');
    bus.emit('comments-replies:loaded');
    return this;
  }

  /**
   * Handle errors
   *
   * @param {String} error
   * @return {CommentsRepliesView} Instance of `CommentsRepliesView`
   * @api public
   */

  errors (errors) {
    this.state('error');

    let span = this.find('span.form-errors');
    errors = errors || [];

    span.empty();
    errors.forEach(err => span.html(span.html() + t(err)));

    // Unregister all `ready` listeners
    this.off('ready');
    return this;
  }

  /**
   * Validate form's fields
   *
   * @param {Object} data
   * @return {Array} of Errors
   * @api public
   */

  validate (data) {
    var errors = [];
    if (!data.text) {
      errors.push('comments.cannot-be-empty');
    }

    if (data.text.length > 4096) {
      errors.push('comments.argument-limited');
    }

    return errors;
  }

  /**
   * Show remove confirmation box
   *
   * @param {Event} ev
   * @api private
   */

  onremove (ev) {
    ev.preventDefault();

    let target = ev.delegateTarget || closest(ev.target, 'a');
    let comment = closest(target, 'li[data-id]');
    o(comment).addClass('remove');
    let btnEdit = o('.btn-reply-edit', comment);
    if (btnEdit) btnEdit.removeClass('hide');
    let mediaBody = o('.media-body', comment);
    mediaBody.removeClass('edit');
  }

  /**
   * Hide remove confirmation box
   *
   * @param {Event} ev
   * @api private
   */

  oncancelremove (ev) {
    ev.preventDefault();

    let target = ev.delegateTarget || closest(ev.target, 'a.cancel-remove');
    let comment = closest(target, 'li[data-id]');
    o(comment).removeClass('remove');
  }

  /**
   * Confirm reply removal
   *
   * @param {Event} ev
   * @api private
   */

  onconfirmremove (ev) {
    ev.preventDefault();

    let target = ev.delegateTarget || closest(ev.target, 'a.cancel-remove');
    let replyEl = closest(target, 'li[data-id]');
    let id = replyEl.getAttribute('data-id');
    let view = this;
    request
      .del('/api/comment/:id/reply/:replyId'.replace(':id', this.comment.id).replace(':replyId', id))
      .end((err, res) => {
        if (err) return log('Fetch error: %s', err);
        if (!res.ok) err = res.error, log('Fetch error: %s', err);
        if (res.body && res.body.error) err = res.body.error, log('Fetch response error: %s', err);

        o(replyEl).removeClass('remove');
        let messageEl = o('.onreply.message', replyEl);
        messageEl.style.display = 'block';
        if (err) {
          return messageEl.innerHTML = err;
        } else {
          log('successfull reply removed %s', id);
          messageEl.innerHTML = t('comments.removed');
          setTimeout((() => replyEl.remove()), 1000);
          view.emit('delete', { id: view.comment.id, replyId: id });
        }
    });
  }

  focus () {
    let form = this.el.find('form.form.reply-form');
    let el = form.length > 0 ? form[0] : null;
    if (!el) return;
    let textarea = this.el.find('textarea', el);

    el.scrollIntoView();
    textarea.focus();
  }
}

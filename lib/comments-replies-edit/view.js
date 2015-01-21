/**
 * Module dependencies.
 */

var template = require('./template');
var FormView = require('form-view');
var log = require('debug')('democracyos:comments-replies-edit');

/**
 * Expose comments view
 */

module.exports = CommentsRepliesEditView;

/**
 * View constructor
 *
 * @param {Comment} comment
 * @constructor
 */

function CommentsRepliesEditView(comment, reply) {
  if (!(this instanceof CommentsRepliesEditView)) {
    return new CommentsRepliesEditView(comment, reply);
  };

  this.comment = comment;
  this.reply = reply;
  FormView.call(this, template, { comment: comment, reply: reply });
}

/**
 * Extend from `FormView`
 */

FormView(CommentsRepliesEditView);

/**
 * Switch on events
 *
 * @api public
 */

CommentsRepliesEditView.prototype.switchOn = function() {
  this.bind('click', 'form.reply-edit-form .btn-cancel', 'oncancel');
  this.on('success', this.bound('onsuccess'));
};

/**
 * Put a comment
 *
 * @param {Object} data
 * @api public
 */

CommentsRepliesEditView.prototype.onsuccess = function(res) {
  this.emit('put', { data: res.body, el: this.el[0] });
}

/**
 * On cancel editing a comment
 *
 * @param {Object} data
 * @api public
 */

 CommentsRepliesEditView.prototype.oncancel = function(ev) {
  ev.preventDefault();
  this.emit('cancel', this.el[0]);
  this.remove();
};
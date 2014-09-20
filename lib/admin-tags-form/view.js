/**
 * Module dependencies.
 */

var FormView = require('form-view');
var images = require('tag-images');
var tags = require('tags');
var t = require('t');
var template = require('./template');

/**
 * Expose TagForm
 */

module.exports = TagForm;

/**
 * Creates a password edit view
 */

function TagForm(tag) {
  if (!(this instanceof TagForm)) {
    return new TagForm(tag);
  };

  this.setOptions(tag);
  FormView.call(this, template, this.options);
}

/**
 * Inherit from `FormView`
 */

FormView(TagForm);

/**
 * Build view's `this.el`
 */

TagForm.prototype.setOptions = function(tag) {
  this.action = '/api/tag/';
  if (tag) {
    this.action += tag.id;
    this.title = 'admin-tags-form.title.edit';
  } else {
    this.action += 'create';
    this.title = 'admin-tags-form.title.create';
  }

  this.options = {
    form: { title: this.title, action: this.action },
    tag: tag || { clauses: [] },
    images: images
  };
}

TagForm.prototype.switchOn = function() {
  this.on('success', this.bound('onsuccess'));
  this.bind('click', 'input[name="image"]', this.bound('onimageclick'));
};

TagForm.prototype.switchOff = function() {
  this.off();
  this.unbind('click', 'input[name="image"]', this.bound('onimageclick'));
};

/**
 * Handle `success` event
 *
 * @api private
 */

TagForm.prototype.onsuccess = function(res) {
  tags.fetch();
  tags.ready(this.bound('onsave'));
}

TagForm.prototype.onsave = function() {
  this.messages([t('admin-tags-form.message.onsuccess')]);
}

TagForm.prototype.onimageclick = function(ev) {
  this.find('input[name="image"]').removeClass('error');
};
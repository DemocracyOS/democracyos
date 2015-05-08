/**
 * Module dependencies.
 */

var FormView = require('../form-view/form-view.js');
var images = require('../tags/images.js');
var tags = require('../tags/tags.js');
var t = require('t');
var template = require('./template.jade');

/**
 * Creates a password edit view
 */

export default class TagForm extends FormView {

  constructor(tag) {
    super();
    this.setOptions(tag);
    super(template, this.options);
  }

  /**
   * Build view's `this.el`
   */

  setOptions(tag) {
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

  switchOn() {
    this.on('success', this.bound('onsuccess'));
    this.bind('click', 'input[name="image"]', this.bound('onimageclick'));
  };

  /**
   * Handle `success` event
   *
   * @api private
   */

  onsuccess(res) {
    tags.fetch();
    tags.ready(this.bound('onsave'));
  }

  onsave() {
    this.messages([t('admin-tags-form.message.onsuccess')]);
  }

  onimageclick(ev) {
    this.find('input[name="image"]').removeClass('error');
  };

}
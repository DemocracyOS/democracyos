/**
 * Module dependencies.
 */

import { remove as diacritics } from 'diacritics';
import page from 'page';
import List from 'list.js';
import tags from '../tags/tags.js';
import template from './template.jade';
import View from '../view/view.js';

/**
 * Creates a list view of tags
 */

export default class TagsListView extends View {

  constructor(forum) {
    super();
    this.tags();
    const opts = this.options;
    opts.forum = forum;
    super(template, opts);
  }

  switchOn() {
    this.list = new List('tags-wrapper', { valueNames: ['tag-title'] });
  }

  /**
   * Build list element into `this.el`
   *
   * @return {TagsListView} self
   * @api public
   */

  tags() {
    function sort(a, b) {
      if (diacritics(a.name.toLowerCase()) < diacritics(b.name.toLowerCase())) {
        return -1;
      }
      if (diacritics(a.name.toLowerCase()) > diacritics(b.name.toLowerCase())) {
        return 1;
      }
      return 0;
    }

    this.options = {
      tags: tags.get().sort(sort)
    };
  }

}
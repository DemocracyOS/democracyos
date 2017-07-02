/**
 * Module dependencies.
 */

import List from 'democracyos-list.js'
import urlBuilder from 'lib/url-builder'
import View from '../../view/view.js'
import template from './template.jade'

/**
 * Creates a list view of tags
 */

export default class TagsListView extends View {
  constructor (options = {}) {
    options.urlBuilder = urlBuilder
    super(template, options)
    this.options = options
  }

  switchOn () {
    this.list = new List('tags-wrapper', { valueNames: ['tag-title'] })
  }
}

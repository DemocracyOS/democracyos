/**
 * Module dependencies.
 */

import List from 'democracyos-list.js'
import urlBuilder from 'lib/url-builder'
import View from 'lib/view/view'
import template from './template.jade'

/**
 * Creates `AdminUsers` view for admin
 */

export default class AdminWhitelists extends View {
  constructor (whitelists) {
    super(template, { whitelists, urlBuilder })
  }

  switchOn () {
    this.list = new List('whitelists-wrapper', {
      valueNames: ['whitelist-title']
    })
  }
}

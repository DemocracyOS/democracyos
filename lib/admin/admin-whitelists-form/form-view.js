/**
 * Module dependencies.
 */

import page from 'page'
import t from 't-component'
import FormView from '../../form-view/form-view.js'
import request from '../../request/request.js'
import whitelists from '../../whitelists/whitelists.js'
import template from './template.jade'

/**
 * Creates a password edit view
 */

export default class WhitelistForm extends FormView {
  constructor (whitelist) {
    super()
    this.whitelist = whitelist
    this.setOptions()
    FormView.call(this, template, this.options)
  }

  setOptions () {
    this.action = '/api/whitelists/'
    if (this.whitelist) {
      this.action += this.whitelist.id
      this.title = 'admin-whitelists-form.title.edit'
    } else {
      this.action += 'create'
      this.title = 'admin-whitelists-form.title.create'
    }

    this.options = {
      form: { title: this.title, action: this.action },
      whitelist: this.whitelist || { new: true }
    }
  }

  switchOn () {
    this.on('success', this.bound('onsuccess'))
    this.bind('click', '.btn-delete', this.bound('ondelete'))
  }

  /**
   * Handle `success` event
   *
   * @api private
   */

  onsuccess (res) {
    whitelists.fetch()
    whitelists.ready(this.bound('onsave'))
  }

  onsave () {
    this.messages([t('admin-whitelists-form.message.onsuccess')])
  }

  ondelete () {
    request
      .del('/api/whitelists/:id'.replace(':id', this.whitelist.id))
      .end(function (err, res) {
        if (err || !res.ok) {
          this.errors([err || res.text])
        }

        whitelists.fetch()
        page('/admin/users')
      })
  }
}

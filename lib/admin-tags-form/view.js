import t from 't-component'
import FormView from '../form-view/form-view'
import images from '../tags/images'
import template from './template.jade'

export default class TagForm extends FormView {

  constructor (tag) {
    super()
    this.setOptions(tag)
    super(template, this.options)
  }

  /**
   * Build view's `this.el`
   */

  setOptions (tag) {
    this.action = '/api/tag/'
    if (tag) {
      this.action += tag.id
      this.title = 'admin-tags-form.title.edit'
    } else {
      this.action += 'create'
      this.title = 'admin-tags-form.title.create'
    }

    this.options = {
      form: { title: this.title, action: this.action },
      tag: tag || { clauses: [] },
      images: images
    }
  }

  switchOn () {
    this.on('success', this.bound('onsuccess'))
    this.bind('click', 'input[name="image"]', this.bound('onimageclick'))
  }

  /**
   * Handle `success` event
   *
   * @api private
   */

  onsuccess (res) {
    this.onsave()
  }

  onsave () {
    this.messages([t('admin-tags-form.message.onsuccess')])
  }

  onimageclick (ev) {
    this.find('input[name="image"]').removeClass('error')
  }
}

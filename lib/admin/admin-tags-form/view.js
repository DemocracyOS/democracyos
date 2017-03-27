import t from 't-component'
import FormView from '../../form-view/form-view'
import images from '../../tags-images'
import template from './template.jade'

export default class TagForm extends FormView {
  constructor (tag) {
    var action = '/api/tag/'
    var title
    if (tag) {
      action += tag.id
      title = 'admin-tags-form.title.edit'
    } else {
      action += 'create'
      title = 'admin-tags-form.title.create'
    }

    var options = {
      form: { title: title, action: action },
      tag: tag || { clauses: [] },
      images: images
    }

    super(template, options)
    this.options = options
  }

  /**
   * Build view's `this.el`
   */

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

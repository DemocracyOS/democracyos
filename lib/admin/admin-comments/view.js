import template from './template.jade'
import View from '../../view/view.js'
import urlBuilder from 'lib/url-builder'

export default class ExportComments extends View {
  constructor (options = {}) {
    options.urlBuilder = urlBuilder
    super(template, options)
    this.options = options
  }
}

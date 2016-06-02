import marked from 'marked'
import View from '../view/view.js'
import md from './pp.md'
import template from './template.jade'

export default class PrivacyPolicyView extends View {

  /**
   * Creates a Privacy Policy view
   */

  constructor () {
    super(template, { md: marked(md) })
  }
}

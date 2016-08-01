import marked from 'marked'
import View from '../../view/view.js'
import md from './tos.md'
import template from './template.jade'

export default class TOSView extends View {

  /**
   * Creates a TOS view
   */

  constructor () {
    super(template, { md: marked(md) })
  }
}

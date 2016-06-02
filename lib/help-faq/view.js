import marked from 'marked'
import md from './faq.md'
import template from './faq-template.jade'
import View from '../view/view.js'

export default class FAQView extends View {

  constructor () {
    super(template, { md: marked(md) })
  }
}

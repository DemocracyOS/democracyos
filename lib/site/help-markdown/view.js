import dosMarkdown from 'marked'
import t from 't-component'
import View from '../../view/view.js'
import template from './template.jade'

export default class MarkdownView extends View {

  /**
   * DemocracyOS markdown guide MarkdownView
   *
   * @return {MarkdownView} `MarkdownView` instance.
   * @api public
   */

  constructor () {
    super(template, { dosMarkdown: dosMarkdown })
    this.playground = this.find('textarea.playground')
    this.result = this.find('.result')
  }

  /**
   * Switch on events
   *
   * @api public
   */

  switchOn () {
    this.bind('keyup', 'textarea.playground', 'onchange')
  }

  /**
   * On text change
   *
   * @param {Object} data
   * @api public
   */

  onchange (ev) {
    let value = this.playground.value()

    if (value !== '') {
      value = dosMarkdown(value)
    } else {
      value = t('markdown.playground.text')
    }

    this.result.html(value)
  }
}

import o from 'component-dom'
import t from 't-component'
import marked from 'marked'
import View from '../../view/view.js'
import md from './glossary.md'
import template from './template.jade'

export default class GlossaryView extends View {

  constructor (word) {
    super(template, { md: marked(md) })
    this.word = word

    if (!this.word) return
    this.elWord = o('#' + this.word, this.el)
      .addClass('selected')

    let back = o(document.createElement('a'))
      .addClass('back')
      .addClass('pull-right')
      .attr('href', '#')
      .html(t('Back'))

    this.elWord.append(back)
  }

  switchOn () {
    this.bind('click', '.back', this.bound('onback'))
  }

  onback (ev) {
    ev.preventDefault()
    window.history.go(-1)
  }

  scroll () {
    if (this.elWord) this.elWord[0].scrollIntoView()
  }
}

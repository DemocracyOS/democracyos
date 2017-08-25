import urlBuilder from 'lib/url-builder'
import View from '../../view/view.js'
import template from './sidebar-template.jade'

export default class Sidebar extends View {
  constructor (forum) {
    super(template, { forum, urlBuilder })
  }

  set (section) {
    if (!section) return
    let select = this.find(`a[data-section=${section}]`).parent('li')
    select.addClass('active')
  }

  unset () {
    let actives = this.find('.active')
    actives.removeClass('active')
    return this
  }
}

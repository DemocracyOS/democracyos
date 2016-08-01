import template from './sidebar-template.jade'
import View from '../../view/view.js'

export default class Sidebar extends View {
  constructor (forum) {
    super(template, {forum})
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

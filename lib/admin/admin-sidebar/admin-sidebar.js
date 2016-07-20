import template from './sidebar-template.jade'
import View from '../../view/view.js'

export default class Sidebar extends View {
  constructor (forum) {
    super(template, {
      forum: forum
    })
  }

  set (section) {
    // Prune trailing subsection if they exist
    section = section && ~section.indexOf('/') ? section.split('/')[0] : section
    let select = this.find(`a[data-section=${section}]`).parent('li')
    select.addClass('active')
  }

  unset () {
    let actives = this.find('.active')
    actives.removeClass('active')
    return this
  }
}

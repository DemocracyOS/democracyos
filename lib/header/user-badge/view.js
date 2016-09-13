import bus from 'bus'
import user from '../../user/user'
import template from './template.jade'
import View from '../../view/view'
import ToggleParent from 'democracyos-toggle-parent'

export default class UserBadgeView extends View {
  constructor () {
    super(template, {user})

    this.updateBadge = this.updateBadge.bind(this)

    let dropdownBtn = super.find('.profile')
    let dropdown = new ToggleParent(dropdownBtn[0])

    this.find('.dropdown-list').on('click', 'li', dropdown.hide)
    this.find('.dropdown-list').on('click', '#logout', e => {
      console.log('logout')
      e.preventDefault()
      bus.emit('logout')
      window.location = '/'
    })
  }

  switchOn () {
    bus.on('forum:change', this.updateBadge)
  }

  switchOff () {
    bus.off('forum:change', this.updateBadge)
  }

  updateBadge (forum) {
    const el = this.el[0]

    if (forum && forum.privileges.canChangeTopics) {
      el.classList.add('can-change-forum')
    } else {
      el.classList.remove('can-change-forum')
    }
  }
}

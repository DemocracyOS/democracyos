import user from '../user/user.js'
import template from './template.jade'
import View from '../view/view.js'
import ToggleParent from 'democracyos-toggle-parent'

export default class UserBadgeView extends View {
  constructor () {
    super(template, { user: user })
    let dropdownBtn = super.find('.profile')
    let dropdown = new ToggleParent(dropdownBtn[0])

    super.find('.dropdown-list').on('click', 'li', dropdown.hide)
  }
}

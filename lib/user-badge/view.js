import citizen from '../citizen/citizen.js';
import template from './template.jade';
import View from '../view/view.js';
import ToggleParent from 'toggle-parent';

export default class UserBadgeView extends View {
  constructor () {
    super(template, { citizen: citizen });
    let dropdownBtn = super.find('.profile');
    let dropdown = new ToggleParent(dropdownBtn[0]);

    super.find('.dropdown-list').on('click', 'li', dropdown.hide);
  }
}

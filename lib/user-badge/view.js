import bus from 'bus';
import user from '../user/user.js';
import template from './template.jade';
import View from '../view/view.js';
import ToggleParent from 'democracyos-toggle-parent';

export default class UserBadgeView extends View {
  constructor () {
    super(template, { user: user });
    let dropdownBtn = super.find('.profile');
    let dropdown = new ToggleParent(dropdownBtn[0]);
    super.find('.dropdown-list').on('click', 'li', dropdown.hide);
  }

  switchOn () {
    bus.on('forum:change', this.updateBadge.bind(this));
  }

  updateBadge (forum) {
    if(forum.privileges)
    	this.el[0].className = (forum.privileges.canChangeTopics)?
    		(~this.el[0].className.indexOf('can-change-forum'))?
    			'' :
    			this.el[0].className + ' can-change-forum' :
    			this.el[0].className.replace(' can-change-forum');
  }
}
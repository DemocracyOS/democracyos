import view from '../view/mixin';
import template from './template.jade';
import List from './list/list';

class Sidebar extends view('appendable') {
  constructor () {
    super(template);
    this.list = new List;
    this.list.appendTo(this.el.querySelector('[data-sidebar-list]'));
    this.filter = this.el.querySelector('[data-sidebar-filter]');
  }

  refresh (items = []) {
    this.list.empty();
    if (items.length) this.list.add(items);
  }
}

const sidebar = new Sidebar;
sidebar.appendTo(document.querySelector('aside.nav-proposal'));

export default sidebar;

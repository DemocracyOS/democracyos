import mixins from '../utils/mixins';
import { Appendable } from '../view/mixins';
import { domRender } from '../render/render';
import template from './template.jade';
import List from './list/list.js';

class Sidebar extends mixins(Appendable) {
  constructor () {
    super();

    this.el = domRender(template);
    this.filter = this.el.querySelector('[data-sidebar-filter]');

    this.list = new List;
    this.list.appendTo(this.el.querySelector('[data-sidebar-list]'));
  }

  refresh (items = []) {
    this.list.empty();
    if (items.length) this.list.add(items);
  }
}

const sidebar = new Sidebar;
sidebar.appendTo(document.querySelector('aside.nav-proposal'));

export default sidebar;

import view from '../../view/mixin';
import { domRender } from '../../render/render';
import template from './template.jade';
import itemTemplate from './item.jade';

export default class List extends view('appendable', 'emptyable') {
  constructor (options = {}) {
    options.template = template;
    super(options);

    this.selected = null;
  }

  add (items) {
    if (Array.isArray(items)) {
      let fragment = document.createDocumentFragment();
      for (let item of items) fragment.appendChild(this.renderItem(item));
      this.el.appendChild(fragment);
    } else {
      this.el.appendChild(this.renderItem(items));
    }
  }

  renderItem (item) {
    return domRender(itemTemplate, {
      item: item,
      active: this.selected === item.id
    });
  }

  select (id = null) {
    if (id === this.selected) return;

    if (this.selected) {
      let selected = this.el.querySelector(`[data-id="${this.selected}"]`);
      if (selected) selected.classList.remove('active');
    }

    if (id) {
      let el = this.el.querySelector(`[data-id="${id}"]`);
      if (el) el.classList.add('active');
    }

    this.selected = id;
  }
}

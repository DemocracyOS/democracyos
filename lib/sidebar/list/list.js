import equals from 'mout/array/equals';
import view from '../../view/mixin';
import { domRender } from '../../render/render';
import template from './template.jade';
import itemTemplate from './item.jade';

export default class List extends view('appendable', 'emptyable') {
  constructor (options = {}) {
    options.template = template;
    super(options);

    this.items = [];
    this.selected = null;
  }

  empty () {
    super.empty();
    this.items = [];
    this.selected = null;
    return this;
  }

  reset (items = []) {
    let sameItems = equals(this.items, items, (a, b) => a.id === b.id);
    if (sameItems) return;
    this.empty();
    this.add(items);
  }

  add (items) {
    if (Array.isArray(items)) {
      if (!items.length) return;
      let fragment = document.createDocumentFragment();
      items.forEach(item => {
        this.items.push(item);
        fragment.appendChild(this.renderItem(item));
      });
      this.el.appendChild(fragment);
    } else {
      if (!items) return;
      this.items.push(items);
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

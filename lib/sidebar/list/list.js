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
    const render = item => {
      return domRender(itemTemplate, {
        item: item,
        active: this.selected === item.id
      });
    };

    if (Array.isArray(items)) {
      let fragment = document.createDocumentFragment();
      for (let item of items) fragment.appendChild(render(item));
      this.el.appendChild(fragment);
    } else {
      this.el.appendChild(render(items));
    }
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

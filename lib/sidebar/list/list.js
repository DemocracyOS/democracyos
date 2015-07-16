import mixins from '../../utils/mixins';
import { Appendable, Emptyable } from '../../view/mixins';
import { domRender } from '../../render/render';
import template from './template.jade';
import itemTemplate from './item.jade';

export default class List extends mixins(Appendable, Emptyable) {
  constructor () {
    super();
    this.el = domRender(template);
  }

  add (items) {
    if (Array.isArray(items)) {
      let fragment = document.createDocumentFragment();
      for (let item of items) {
        let el = domRender(itemTemplate, { item: item });
        fragment.appendChild(el);
      }
      this.el.appendChild(fragment);
    } else {
      let el = domRender(itemTemplate, { item: items });
      this.el.appendChild(el);
    }
  }
}

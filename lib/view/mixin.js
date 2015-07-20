import dom from 'component-dom';
import mixin from '../utils/mixin';
import { domRender } from '../render/render';

class Constructor {
  constructor (template, locals = {}) {
    this.template = template;
    this.locals = locals;
    this.el = domRender(this.template, this.locals);
  }
}

const mixins = {
  appendable: {
    appendTo (el) {
      el.appendChild(this.el);
      return this;
    }
  },

  emptyable: {
    empty () {
      dom(this.el).empty();
      return this;
    }
  }
};

/**
 * View Mixin, allows to compose a complex view.
 *
 * E.g.:

import view from '../view/mixin';

class Sidebar extends view('appendable', 'emptyable') {
  // Own implementation
}

**/

export default function view(...names) {
  return mixin(Constructor, ...names.map(name => mixins[name]));
}

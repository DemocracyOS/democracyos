import dom from 'component-dom';
import mixin from '../utils/mixin';
import { domRender } from '../render/render';

class Base {
  constructor (options = {}) {
    this.options = options;
    this.render();
  }

  render () {
    this.el = domRender(this.options.template, this.options.locals);
  }
}

export const mixins = {
  appendable: {
    constructor () {
      if (this.options.container) this.appendTo(this.options.container);
    },

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
  },

  removeable: {
    remove () {
      dom(this.el).remove();
      return this;
    }
  },

  withEvents: {
    bind (...args) {
      dom(this.el).on(...args);
    },

    unbind (...args) {
      dom(this.el).off(...args);
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
  return mixin(Base, ...names.map(name => mixins[name]));
}

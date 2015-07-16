import dom from 'component-dom';

export const Appendable = {
  appendTo (el) {
    el.appendChild(this.el);
    return this;
  }
};

export const Emptyable = {
  empty () {
    dom(this.el).empty();
    return this;
  }
};

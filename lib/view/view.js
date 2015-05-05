import o from 'component-dom';
import inserted from 'inserted';
import removed from 'removed';
import Stateful from '../stateful/stateful.js';
import { dom } from '../render/render.js';

export default class View extends Stateful {
  constructor (template, locals) {
    super();
    this.template = template;
    this.locals = locals || {};
    this.events = [];
    this._bound = {};
  }

  build () {
    this.el = o(dom(this.template, this.locals));
    inserted(this.el[0], this._oninsert.bind(this));
  }

  ensureDom () {
    if (!this.el) this.build();
  }

  remove () {
    this.ensureDom();
    this.el.remove();
  }

  _oninsert () {
    this.emit('insert');
    if (this.switchOn && 'function' === typeof this.switchOn) {
      this.switchOn();
    }
    removed(this.el[0], this._onremove.bind(this));
  }

  /**
   * Default handler when
   * `el` is removed
   */

  _onremove () {
    this.emit('remove');
    this.unbind();
    this.off();
    if (this.switchOff && 'function' === typeof this.switchOff) {
      this.switchOff();
    }
    inserted(this.el[0], this._oninsert.bind(this));
  }

  /**
   * Find an element inside `el`
   * by a given selector
   */

  find (selector, context) {
    this.ensureDom();
    return this.el.find(selector, context);
  }

  bind (event, selector, fn, capture) {
    if ('string' === typeof(fn)) {
      fn = this.bound(fn);
    }

    this.events.push({
      event: event,
      selector: selector,
      fn: fn,
      capture: capture
    });

    this.ensureDom();
    return this.el.on(event, selector, fn, capture);
  }

  /**
   * Unbind a method handler to an event
   */

  unbind (event, selector, fn, capture) {
    if (arguments.length === 0) {
      this.unbindAll();
    }

    if ('string' === typeof(fn)) {
      fn = this.bound(fn);
    }

    this.ensureDom();
    return this.el.off(event, selector, fn, capture);
  }

  unbindAll () {
    let view = this;
    this.events.forEach(ev => view.unbind(ev.event, ev.selector, ev.fn, ev.capture));
  }

  appendTo (el) {
    this.ensureDom();
    return this.el.appendTo(el);
  }

  replace (el) {
    this.ensureDom();
    this.wrapper = el;
    this.emit('replace', o(this.wrapper));
    return this.refresh();
  }

  refresh () {
    this.ensureDom();
    this.wrapper = this.wrapper || this.el[0].parentNode;
    if (!this.wrapper) return;
    o(this.wrapper).empty().append(this.render());
    return this;
  }

  render () {
    this.ensureDom();
    this.emit('render');
    return this.el;
  }

  bound (method) {
    if (!this._bound[method]) {
      this._bound[method] = this[method].bind(this);
    }

    return this._bound[method];
  }
}

import template from './template.jade';
import page from 'page';
import View from '../view/view.js';

export default class ForumView extends View {

  constructor (locals) {
    super(template, locals);
    this.url = locals.url;
  }

  switchOn () {
    this.el.on('click', this.bound('onclick'));
  }

  onclick () {
    this.url ? window.location = this.url : page('/signin');
  }
}

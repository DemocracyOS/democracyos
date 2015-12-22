import view from '../view/mixin';
import template from './template.jade';
import forumStore from '../forum-store/forum-store';

window.forumStore = forumStore;

export default class AdminPermissions extends view('appendable') {
  constructor (options = {}) {
    options.template = template;
    super(options);
  }
}

import dom from 'component-dom';
import view from '../view/mixin';
import forumStore from '../forum-store/forum-store';
import template from './template.jade';
import Role from './role/role';

const View = view('appendable', 'emptyable', 'loadable');

export default class AdminPermissions extends View {
  constructor (options = {}) {
    options.template = template;
    super(options);

    this.list = this.el.querySelector('.admin-permissions-lists');
  }

  switchOn () {
    this.reset();
  }

  reset () {
    this.loading(true);

    forumStore.getPermissions(this.options.forum.id)
      .then(permissions => {
        const fragment = document.createDocumentFragment();

        Object.keys(permissions).forEach(role => {
          let users = permissions[role];
          new Role({
            container: fragment,
            forum: this.options.forum,
            role,
            users
          });
        });

        dom(this.list).empty();
        this.list.appendChild(fragment);
        this.loading(false);
      });
  }
}

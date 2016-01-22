import dom from 'component-dom';
import view from '../view/mixin';
import forumStore from '../forum-store/forum-store';
import template from './template.jade';
import Role from './role/role';
import roles from '../models/forum/roles';

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

        this.renderOwner().appendTo(fragment);

        roles.forEach(role => {
          let users = permissions.filter(p => p.role === role).map(p => p.user);
          new Role({
            container: fragment,
            forum: this.options.forum,
            canRevoke: true,
            canAdd: true,
            role,
            users
          });
        });

        dom(this.list).empty();
        this.list.appendChild(fragment);
        this.loading(false);
      })
      .catch(console.error.bind(console));
  }

  renderOwner () {
    return new Role({
      forum: this.options.forum,
      canRevoke: false,
      canAdd: false,
      role: 'owner',
      users: [this.options.forum.owner]
    });
  }
}

import dom from 'component-dom';
import view from '../view/mixin';
import forumStore from '../forum-store/forum-store';
import template from './template.jade';
import Role from './role/role';
import roles from '../models/forum/roles';

export default class AdminPermissions extends view(
  'appendable',
  'emptyable',
  'loadable',
  'withEvents'
) {
  constructor (options = {}) {
    options.template = template;
    options.locals = {
      forum: options.forum
    };

    super(options);

    this.onUpdate = this.onUpdate.bind(this);

    this.list = this.el.querySelector('.admin-permissions-lists');
  }

  switchOn () {
    this.reset();
    this.bind('change', 'input[type="checkbox"][name]', this.onUpdate)
  }

  switchOff () {
    this.unbind('change', 'input[type="checkbox"][name]', this.onUpdate)
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

  onUpdate () {
    var data = {
      private: this.el.querySelector('[name="private"]').checked,
      closed: this.el.querySelector('[name="closed"]').checked
    }

    forumStore.update(this.options.forum.id, data)
      .then(console.log.bind(console))
      .catch(console.error.bind(console))
  }
}
